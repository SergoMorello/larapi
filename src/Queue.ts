import Http from "./Http";
import type { TResolveData } from "./types";

type TQueue = {
	[index: string]: Http;
};

class Queue<DATA extends TResolveData = TResolveData> {
	private static _Queue: TQueue = {};
	private queue = Queue._Queue;
		http: Http<DATA>;

	constructor(http: Http<DATA>) {
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
			refInstance?.addListener('api-request-success', this.http.success);
			refInstance?.addListener('api-request-error', this.http.error);
			refInstance?.addListener('api-request-fail', this.http.fail);
			refInstance?.addListener('api-request-complete', this.http.complete);
		}
		return refInstance instanceof Http;
	}
}

export default Queue;