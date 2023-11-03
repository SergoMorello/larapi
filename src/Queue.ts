import Http from "./Http";

type TQueue = {
	[index: string]: Http;
};

class Queue {
	private static instance = new Queue;
	private queue: TQueue = {};

	constructor() {
		this.has = this.has.bind(this);
		this.get = this.get.bind(this);
		this.push = this.push.bind(this);
	}

	public has(request: string) {
		return request in this.queue;
	}

	public get(request: string) {
		return this.has(request) ? this.queue[request] : undefined;
	}

	public push(request: string, instance: Http): boolean {
		const refInstance = this.get(request);
		if (!refInstance) {
			this.queue[request] = instance;
		}else{
			refInstance?.addListener('api-request-success', instance.success);
			refInstance?.addListener('api-request-error', instance.error);
			refInstance?.addListener('api-request-fail', instance.fail);
			refInstance?.addListener('api-request-complete', instance.complete);
		}
		return refInstance instanceof Http;
	}

	public static has = this.instance.has;
	public static get = this.instance.get;
	public static push = this.instance.push;
}

export default Queue;