import Http from "./Http";
import type { TResponseData } from "./types";

type TQueue = {
	[index: string]: Http;
};

class Queue<D extends TResponseData = TResponseData> {
	private static _Queue: TQueue = {};
	private queue = Queue._Queue;
		http: Http<D>;

	constructor(http: Http<D>) {
		this.http = http;
		this.has = this.has.bind(this);
		this.get = this.get.bind(this);
		this.clear = this.clear.bind(this);
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

	public push(request: string): boolean {
		const refInstance = this.get(request);
		if (!refInstance) {
			(this.queue[request] as any) = this.http;
		}else{
			refInstance?.addListener('api-request-success', this.http.handleSuccess);
			refInstance?.addListener('api-request-error', this.http.handleError);
			refInstance?.addListener('api-request-fail', this.http.handleFail);
			refInstance?.addListener('api-request-complete', this.http.handleComplete);
			refInstance?.addListener('api-request-abort', this.http.handleAbort);
		}
		return refInstance instanceof Http;
	}
}

export default Queue;