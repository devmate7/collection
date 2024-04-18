function inWorker() {
	return 'WorkerGlobalScope' in self
		&& self instanceof WorkerGlobalScope;
}

function inWorklet() {
	return 'WorkletGlobalScope' in self
		&& self instanceof WorkletGlobalScope;
}

export default class Workmate {};
