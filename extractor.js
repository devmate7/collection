class Extractor {
	constructor(id) {
		if (!this.constructor.isValidId(id)) {
			throw new Error();
		}

		this.id = id;
	}

	async retrieve() {
		const html = await fetch(location.href).then(r => r.text());
		const base = /src="([^"]+?\/base\.js)"/.exec(html)[1];
		const json = /ytInitialPlayerResponse = (.+?);(?:var meta|<\/script>)/.exec(html)[1];

		const js = await fetch(base).then(r => r.text());
		const [scramble, name] = /function\(a\){a=a.split\(""\);(\w+)\..+?;return a.join\(""\)}/s.exec(js);
		const utils = new RegExp(`${name}=({.+?}})`, 's').exec(js)[1];

		this.$data = JSON.parse(json).streamingData.adaptiveFormats;
		this.decipherer = new Function(
			'sig',
			`return (${name}=>${scramble}(sig))(${utils})`
		);

		return this;
	}

	decipher() {
		return this.decipherer();
	}

	async generate(itag) {
		const format = this.$data.find(format => format.itag === +itag);

		if (format.url) {
			return format.url;
		}

		const cipher = new URLSearchParams(format.signatureCipher);
		const sign = await this.scramble(cipher.get('s') || '');

		return cipher.get('url')?.concat('&sig=', sign);
	}

	list() {
		return this.$data.reduce(
			(a, v) => (a[v.itag] = v.mimeType, a),
			{}
		);
	}

	async static from(id) {
		const obj = new this(id);
	}

	static isValidId(id) {
		return /^[-\w]{11}$/.test(id);
	}

	static getIdFromURL(url) {
		return /^https?:\/\/(?:(?:m|music|www)\.)?youtu(?:be\.com\/(?:watch\?v=|(?:embed|live|shorts)\/)|\.be\/)([-\w]{11})/.exec(url)[1];
	}

	static open(src) {
		const html = `
<!DOCTYPE html>
<html>

<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title></title>
	<style>
		* {
			margin: 0;
			padding: 0;
			box-sizing: border-box;
		}
	</style>
</head>

<body>
	<video autoplay controls loop src="${src}"></video>
</body>

</html>
`;

		return window.open('').document.write(html.trim());
	}
}

(async function (build) {
	const Ytdl = build();
	const ytdl = await new Extractor().retrieve();
	const list = ytdl.list();

	const menu = ''.concat(
		'Here are ', list.length, ' formats found:\n',
		Object.keys(list).join(', '),
		'.\n\nWhich one would you like?'
	);

	do {
		if (
			(itag = prompt(menu)) &&
			(type = list[+itag])
		) continue;

		return alert('Cancelled.');
	} while (!confirm(''.concat(
		'Here is the content type of this format:\n',
		type,
		'\n\nIs this format what you would like?'
	)));

	window.open(await ytdl.generate(itag));
})();
