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
		this.clear = this.clear.bind(this);
		this.withClear = this.withClear.bind(this);
		this.push = this.push.bind(this);
	}

	public has(request: string) {
		return request in this.queue;
	}

	public get(request: string) {
		return this.has(request) ? this.queue[request] : undefined;
	}

	public clear(request: string) {
		if (this.has(request)) {
			delete this.queue[request];
		}
	}

	private withClear(request: string, callback: (args: any) => void) {
		this.clear(request);
		return callback;
	}

	public push(request: string, instance: Http): boolean {
		const refInstance = this.get(request);
		if (!refInstance) {
			this.queue[request] = instance;
		}else{
			refInstance?.addListener('api-request-success', this.withClear(request, instance.success));
			refInstance?.addListener('api-request-error', this.withClear(request, instance.error));
			refInstance?.addListener('api-request-fail', this.withClear(request, instance.fail));
			refInstance?.addListener('api-request-complete', this.withClear(request, instance.complete));
		}
		return refInstance instanceof Http;
	}

	public static has = this.instance.has;
	public static get = this.instance.get;
	public static push = this.instance.push;
}

export default Queue;