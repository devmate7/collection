(function (introduce) {
	const { clamp, link } = introduce();

	const audio = document.createElement('audio');
	const input = document.createElement('input');

	audio.controls = true;
	input.accept = 'application/gzip';
	input.type = 'file';

	audio.addEventListener('loadedmetadata', () => audio.play());
	input.addEventListener(
		'change',
		async () => input.files.length !== 0
			&& (audio.src = await link(input.files[0]))
	);

	clamp(audio);
	document.body.append(audio, input);
})(function (audio, input) {
	function clamp(audio) {
		const ac = new AudioContext();
		const dcn = ac.createDynamicsCompressor();
		const esn = ac.createMediaElementSource(audio);

		dcn.connect(ac.destination);
		esn.connect(dcn);
	}

	async function compress(blob) {
		const rs = blob.stream();
		const cs = new CompressionStream('gzip');
		const crs = rs.pipeThrough(cs);

		return await new Response(crs).blob();
	}

	async function decompress(blob) {
		const rs = blob.stream();
		const ds = new DecompressionStream('gzip');
		const drs = rs.pipeThrough(ds);

		return await new Response(drs).blob();
	}

	function download(href, name) {
		const anchor = Object.assign(
			document.createElement('a'),
			{ download: name, href }
		);

		document.body.appendChild(anchor);
		anchor.click();
		document.body.removeChild(anchor);
	}

	async function link(file) {
		const blob = await decompress(file);

		return URL.createObjectURL(blob);
	}

	return {
		clamp,
		compress,
		decompress,
		download,
		link
	};
});



(async function (source) {
	const stream = source.captureStream();
	const track = stream.getVideoTracks()[0];
	const catcher = new ImageCapture(track);
	const bitmap = await catcher.grabFrame();
	const film = document.createElement('canvas');
	const ctx = film.getContext('bitmaprenderer');

	film.width = bitmap.width;
	film.height = bitmap.height;

	ctx.transferFromImageBitmap(bitmap);
	film.toBlob(x => window.open(URL.createObjectURL(x)));
})($0);

(async function (source) {
	const stream = source.captureStream();
//	const stream = source.captureStream(0);
//	const track = stream.getVideoTracks()[0].requestFrame();
	const recorder = new MediaRecorder(track);
	const chunks = [];

	recorder.addEventListener('dataavailable', e => chunks.push(e.data));
	recorder.addEventListener(
		'stop',
		e => URL.createObjectURL(new Blob(chunks, { type: recorder.mimeType }))
	);

	recorder.start();
	recorder.stop();
})($0);

const recorder = await (async function (source) {
	const stream = await navigator.mediaDevices.getDisplayMedia({ audio: true });
	const recorder = new MediaRecorder(stream);
	const chunks = [];

	recorder.addEventListener('dataavailable', e => chunks.push(e.data));
	recorder.addEventListener(
		'stop',
		e => console.log(URL.createObjectURL(new Blob(chunks, { type: recorder.mimeType })))
	);

	return recorder;
})();
