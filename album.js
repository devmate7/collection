/**
 * Get IP address of client
 *
 * @returns Promise<string|void>
 */
export async function address() {
	return await fetch('https://api.ipify.org').then(
		r => r.text(),
		e => console.error(e)
	);
}

async function compress(text) {
	const data = new TextEncoder().encode(text);
	const stream = new CompressionStream('gzip');
	const writer = stream.writable.getWriter();

	await writer.write(data);
	await writer.close();

	return new Response(stream.readable).arrayBuffer();
}

async function decompress(data) {
	const stream = new DecompressionStream('gzip');
	const writer = stream.writable.getWriter();

	await writer.write(data);
	await writer.close();

	return new TextDecoder().decode(
		await new Response(stream.readable).arrayBuffer()
	);
}

export async function estimate() {
	return await navigator.storage.estimate();
}

/**
 * Determines whether `url` is available for archiving
 *
 * @arg {string} url URL to test
 * @returns Promise<object>
 */
export async function isArchivable(url) {
	const link = ''.concat(
		'https://archive.org/wayback/available/?url=',
		encodeURIComponent(url || document.URL)
	);

	return await fetch(link).then(
		r => r.json(),
		e => console.error(e)
	);
}

export async function isIncognito() {
	return await navigator.storage.persist();
}

function toOrdinal(value) {
	const index = (value % 100 < 20 ? value : value % 10) - 1;

	return value + (['st', 'nd', 'rd'][index] ?? 'th');
}

function speak(text) {
	const voice = speechSynthesis.getVoices()[0];
	const ssu = Object.assign(
		new SpeechSynthesisUtterance(text),
		{ voice }
	);

	return speechSynthesis.speak(ssu), speechSynthesis;
}

/**
 * @arg {*} value
 * @arg {number} index
 * @arg {any[]} array
 * @returns {boolean}
 * @example
 * [1, 2, 2, 3, 3, 3].filter(distinctify);
 * // [1, 2, 3]
 */
function distinctify(value, index, array) {
	return array.indexOf(value) === index;
}

async function lock() {
	return await navigator.wakeLock.request();
}

function once(callback) {
	return function fn(e) {
		e.currentTarget.removeEventListener(e.type, fn);

		return callback.call(e.currentTarget, e);
	};
}

function vibrate() {
	return navigator.vibrate([]);
}

function toDataURL(blob) {
	const reader = new FileReader();

	return new Promise(resolve => {
		reader.addEventListener('load', () => resolve(reader.result));
		reader.readAsDataURL(blob);
	});
}

function randomize(length) {
	return Array.from(
		crypto.getRandomValues(new Uint8Array(length / 2)),
		x => x.toString(16).padStart(2, 0)
	).join('');
}

function getImage(src) {
	const img = new Image();

	return new Promise(resolve => {
		img.addEventListener('load', () => resolve(img));
		Object.assign(img, { crossOrigin: 'anonymous', src });
	});
}

function drawImage(canvas, img) {
	Object.assign(canvas, { width: img.naturalWidth, height: img.naturalHeight });
	canvas.getContext('2d').drawImage(img, 0, 0);
}

function toInt16Array(value) {
	return Int16Array.from(
		value,
		x => Math.max(-0x7fff, Math.min(0x7fff, x * 0x8000))
	);
}

function getAllChannelData(buffer) {
	return Array.from(
		Array(buffer.numberOfChannels),
		(x, i) => buffer.getChannelData(i)
	);
}

async function toArrayBuffer(base64) {
	const url = 'data:application/octet-stream;base64,' + base64;

	return await fetch(url).then(r => r.arrayBuffer());
}

function toDataURL(blob) {
	const reader = new FileReader();

	return new Promise(
		resolve => (
			reader.addEventListener('load', e => resolve(e.result)),
			reader.readAsDataURL(blob)
		)
	);
}

function toDataURL(object) {
	const list = data.filter((x, i, self) => self.indexOf(x) === i);
	const json = JSON.stringify(list);

	return 'data:application/json;base64,'.concat(btoa(json));
}

function toArrayBuffer(base64) {
	return Uint8Array.from(window.atob(base64), x => x.codePointAt(0)).buffer;
}
