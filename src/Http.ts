import md5 from 'md5';
import Core from "./Core";
import Queue from './Queue';
import EventEmitter,{
	Event,
	Events
} from "easy-event-emitter";
import type {
	TMethod,
	TParams,
	TData,
	TRequestParams,
	TListenerEvents
} from "./types";

class Http extends Core {
	private cacheIndex: string;
		currentCache?: TData;
		currentEvents: Events
		requestParams: TRequestParams;
		method: TMethod;
		params: TParams;
		path: string;

	constructor(method: TMethod, params: TParams, context?: Core) {
		super(context);
		this.currentEvents = new EventEmitter();
		this.cacheIndex = '';
		this.method = method;
		this.params = params;
		this.path = this.params.path;
		this.requestParams = {
			method: this.method
		};

		this.success = this.success.bind(this);
		this.fail = this.fail.bind(this);
		this.error = this.error.bind(this);
		this.complete = this.complete.bind(this);
		this.setEmit = this.setEmit.bind(this);
		this.request = this.request.bind(this);
		this.addHeader = this.addHeader.bind(this);
		this.deleteHeader = this.deleteHeader.bind(this);

		this.initRequest();
		this.initCache();
	}

	private initRequest(): void {
		this.requestParams.headers = {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		};

		this.params.data = this.params.data ? this.cuteUndifinedParams(this.params.data) : this.params.data;

		if ((['GET', 'HEAD'] as TMethod[]).includes(this.method)) {
			if (this.params.data)
				this.path = this.params.path + '?' + this.encodeUrlParams(this.params.data);

			if (this.method === 'HEAD') {
				this.requestParams.withoutResponse = true;
			}
		}

		if ((['POST', 'PUT', 'CONNECT', 'PATH'] as TMethod[]).includes(this.method)) {
			this.requestParams.body = JSON.stringify(this.params.data);
		}

		if ((['PUT', 'DELETE', 'CONNECT', 'OPTIONS', 'TRACE'] as TMethod[]).includes(this.method)) {
			this.params.cache = false;
		}
	}

	private initCache(): void {
		this.cacheIndex = md5(this.path + JSON.stringify(this.params.data));
		if (this.params.globalName) {
			if (this.initData[this.params.globalName]) {
				this.setCache(this.cacheIndex, this.initData[this.params.globalName], (typeof this.params.cache === 'boolean' ? undefined : this.params.cache));
				this.params.cache = this.params.cache ?? true;
				delete this.initData[this.params.globalName];
			}
		}
		if (this.params.cache) {
			if (this.currentCache = this.getCache(this.cacheIndex)) {
				this.success(this.currentCache);
				this.complete(this.currentCache);
			}	
		}else{
			this.deleteCache(this.cacheIndex);
		}
	}

	private setEmit(event: TListenerEvents, args: any) {
		this.currentEvents.emit(event, args[0]);
		this.events.emit(event, {
			cacheIndex: this.cacheIndex,
			args: args[0]
		});
	}

	//Заголовки от 200 до 299
	public success(...args: any) {
		if (typeof this.params.success === 'function')
			this.params.success(...args);
		if (this.params.cacheUpdate && this.params.data) {
			this.updateCacheGroup(
				typeof this.params.cacheUpdate === 'string' ? this.params.cacheUpdate : this.params.cacheUpdate.group,
				this.params.data,
				typeof this.params.cacheUpdate === 'string' ? undefined : this.params.cacheUpdate.fieldKey);
		}
		
		if (this.params.cacheClear && this.params.data) {
			this.clearCacheGroup(
				typeof this.params.cacheClear === 'string' ? this.params.cacheClear : this.params.cacheClear.group,
				this.params.data,
				typeof this.params.cacheClear === 'string' ? undefined : this.params.cacheClear.fieldKey);
		}
		this.setEmit('api-request-success', args);
	}

	//Заголовки от 400 до 499
	public fail(...args: any) {
		if (typeof this.params.fail === 'function') {
			this.params.fail(...args);
		}
		
		this.setEmit('api-request-fail', args);
	}

	//Все остальные
	public error(...args: any) {
		if (typeof this.params.error === 'function') {
			this.params.error(...args);
		}
		
		this.setEmit('api-request-error', args);
	}

	public complete(...args: any) {
		if (typeof this.params.complete === 'function') {
			this.params.complete(...args);
		}	

		this.setEmit('api-request-complete', args);
	}

	private encodeUrlParams(data: TData) {
		return Object.keys(data).map(function(k) {
			return encodeURIComponent(k) + "=" + encodeURIComponent(data[k]);
		}).join('&');
	}

	private cuteUndifinedParams(data: TData) {
		if (typeof data !== 'object') {
			return;
		}
		for(const key in data) {
			if (!data[key]) {
				delete data[key];
			}
		}
		return data;
	}

	public request(): this {
		if (typeof XMLHttpRequest === 'undefined' || this.currentCache || Queue.push(this.cacheIndex, this)) return this;
		
		try {
			const xhr = new XMLHttpRequest();

			xhr.open(this.method, this.host + this.path, true);
			for(const header in this.requestParams.headers) {
				xhr.setRequestHeader(header, this.requestParams.headers[header]);
			}

			xhr.onreadystatechange = () => {
				if (xhr.readyState !== 4) return;
				
				const result = (!this.requestParams.withoutResponse && this.isJsonString(xhr.responseText)) ? JSON.parse(xhr.responseText) : {};

				if (xhr.status >= 200 && xhr.status <= 299) {
					if (this.params.cache) {
						this.setCache(this.cacheIndex, result, (typeof this.params.cache === 'boolean' ? undefined : this.params.cache));
					}
					this.success(result);
				}else{
					if (xhr.status >= 400 && xhr.status <= 499) {
						this.fail(result);
					}
					
					this.error(result);
					console.warn(result);
				}
				this.complete(result);
				Queue.clear(this.cacheIndex);
			}
			xhr.send(this.requestParams.body);
		}catch(e) {
			console.warn(e);
			throw e;
		}
		return this
	}

	public addHeader(key: string, value: string): this {
		this.requestParams.headers = {...this.requestParams.headers, [key]: value};
		return this;
	}

	public addListener(event: TListenerEvents, callback: (data: any) => void): Event {
		return this.currentEvents.addListener(event, callback);
	}

	public deleteHeader(key: string): this {
		if (this.requestParams.headers && (key in this.requestParams.headers)) {
			delete this.requestParams.headers[key];
		}
		return this;
	}

	public updateCache(data: TData, fieldKey: string | null = 'id'): void {
		const cache = this.getCacheByIndex(this.cacheIndex);
		if (cache && cache.group) {
			this.updateCacheGroup(cache.group, data, fieldKey);
		}
	}

	public clearCache(data?: TData, fieldKey: string | null = 'id'): void {
		if (data) {
			const cache = this.getCacheByIndex(this.cacheIndex);
			if (cache && cache.group) {
				this.clearCacheGroup(cache.group, data, fieldKey);
			}
		}else{
			this.deleteCache(this.cacheIndex);
		}
	}
}

export default Http;