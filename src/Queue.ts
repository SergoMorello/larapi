import type Http from "./Http";

type TQueue = {
	[index: string]: Http[];
};

class Queue {
	private queue: TQueue = {};

	public has(request: string) {
		return request in this.queue;
	}

	public push(request: string, instance: Http): boolean {
		const hasExist = this.has(request);
		this.queue[request].push(instance);
		return hasExist;
	}
}

export default Queue;