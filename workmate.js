const AsyncFunction = (async function () {}).constructor;
const AsyncGeneratorFunction = (async function* () {}).constructor;
const GeneratorFunction = (function* () {}).constructor;

function inWorker() {
	return 'WorkerGlobalScope' in self
		&& self instanceof WorkerGlobalScope;
}

function inWorklet() {
	return 'WorkletGlobalScope' in self
		&& self instanceof WorkletGlobalScope;
}

function isArrowFunction(value) {
	return isFunction(value)
		&& value.name === ''
		&& 'prototype' in value;
}

function isAsyncFunction(value) {
	return isFunction(value)
		&& value instanceof AsyncFunction;
}

function isAsyncGeneratorFunction(value) {
	return isFunction(value)
		&& value instanceof AsyncGeneratorFunction;
}

function isFunction(value) {
	return typeof value === 'function';
}

function isGeneratorFunction(value) {
	return isFunction(value)
		&& value instanceof GeneratorFunction;
}

function isNativeFunction(value) {
	return isFunction(value)
		&& value.toString().endsWith('{ [native code] }');
}

export default class Workmate {};
