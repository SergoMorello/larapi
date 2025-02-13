import md5 from 'md5';
import Core from "./Core";
import Queue from './Queue';
import EventEmitter,{
	EventListener
} from "easy-event-emitter";
import type {
	TMethod,
	TParams,
	TData,
	TRequestParams,
	TListenerEvents,
	TCacheControll,
	TRequestProgress,
	TResponseData,
	TRequestHeaders
} from "./types";

class Http<D extends TResponseData = TResponseData, PATH = any, DATA extends ((...args: any) => any) = any> extends Core {
	private cacheIndex: string;
	private currentCache?: TData;
	private currentEvents: EventEmitter
	private requestParams: TRequestParams;
	private method: TMethod;
	private params: TParams<PATH, DATA>;
	private path: string;
	private queue: Queue<D>;
	private queueName: string;
	private _promise?: Promise<DATA>;

	constructor(method: TMethod, params: TParams<PATH, DATA>, context?: Core) {
		super(context);
		this.currentEvents = new EventEmitter();
		this.queue = new Queue<D>(this);
		this.cacheIndex = '';
		this.queueName = '';
		this.method = method;
		this.params = params;
		this.path = this.params.path as string;
		this.requestParams = {
			method: this.method
		};

		this.requestParams.headers = {
			...this.params.headers
		};
		
		this.success = this.success.bind(this);
		this.fail = this.fail.bind(this);
		this.error = this.error.bind(this);
		this.complete = this.complete.bind(this);
		this.progress = this.progress.bind(this);
		this.setEmit = this.setEmit.bind(this);
		this.request = this.request.bind(this);
		this.addHeader = this.addHeader.bind(this);
		this.deleteHeader = this.deleteHeader.bind(this);

		this.initRequest();
		this.initCache();
		this.initQueue();
	}

	private initRequest(): void {
		
		this.params.data = this.params.data ? this.cuteUndifinedParams(this.params.data) : this.params.data;

		if ((['GET', 'HEAD'] as TMethod[]).includes(this.method)) {
			if (this.params.data)
				this.path = (this.params.path as string) + '?' + this.encodeUrlParams(this.params.data);

			if (this.method === 'HEAD') {
				this.requestParams.withoutResponse = true;
			}
		}

		if ((['POST', 'PUT', 'CONNECT', 'PATH'] as TMethod[]).includes(this.method)) {
			this.requestParams.body = this.params.body ?? JSON.stringify(this.params.data);
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
			if (typeof this.params.cache === 'string') {
				this.events.addListener('trigger-request-by-cache-' + this.params.cache, this.request);
			}
			if (this.currentCache = this.getCache(this.cacheIndex)) {
				this.success(this.currentCache);
				this.complete(this.currentCache);
			}	
		}else{
			this.deleteCache(this.cacheIndex);
		}
	}

	public get promise() {
		return this._promise;
	}

	private initQueue(): void {
		this.queueName = this.params.queueThrottling ? md5(this.path) : this.cacheIndex;
	}

	private setEmit<EVENT extends keyof TListenerEvents, DATA extends TListenerEvents[EVENT]>(event: EVENT, data: DATA) {
		this.currentEvents.emit(event, data);
		this.events.emit(event, {
			cacheIndex: this.cacheIndex,
			data
		});
	}

	//Заголовки от 200 до 299
	public success(data: any) {
		if (typeof this.params.success === 'function')
			this.params.success(data);
		if (this.params.cacheUpdate && this.params.data) {
			this.groupFromArray<TCacheControll>(this.params.cacheUpdate, (cacheUpdate, params) => {
				this.updateCacheGroup(
					typeof cacheUpdate === 'string' ? cacheUpdate : cacheUpdate.group,
					this.params.data ?? {},
					typeof cacheUpdate === 'string' ? undefined : cacheUpdate.fieldKey);
			}, true);
		}
		
		if (this.params.cacheClear && this.params.data) {
			this.groupFromArray<TCacheControll>(this.params.cacheClear, (cacheClear) => {
				this.clearCacheGroup(
					typeof cacheClear === 'string' ? cacheClear : cacheClear.group,
					this.params.data,
					typeof cacheClear === 'string' ? undefined : cacheClear.fieldKey);
			});
		}
		this.setEmit('api-request-success', data);
	}

	//Заголовки от 400 до 499
	public fail(data: any) {
		if (typeof this.params.fail === 'function') {
			this.params.fail(data);
		}
		
		this.setEmit('api-request-fail', data);
	}

	//Все остальные
	public error(data: any) {
		if (typeof this.params.error === 'function') {
			this.params.error(data);
		}
		
		this.setEmit('api-request-error', data);
	}

	public complete(data: any) {
		if (typeof this.params.complete === 'function') {
			this.params.complete(data);
		}	

		this.setEmit('api-request-complete', data);
	}

	public progress(progress: TRequestProgress) {
		if (typeof this.params.progress === 'function') {
			this.params.progress(progress);
		}	

		this.setEmit('api-request-progress', progress);
	}

	private encodeUrlParams(data: TData) {
		return Object.entries(data).map(([key, value]) => {
			if (Array.isArray(value)) {
				return value.map((val) => encodeURIComponent(key) + "[]=" + encodeURIComponent(val)).join('&');
			}
			if (typeof value === 'object') {
				value = JSON.stringify(value);
			}
			return encodeURIComponent(key) + "=" + encodeURIComponent(value);
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

	public request(force?: boolean): this {

		if (typeof XMLHttpRequest === 'undefined' || (!force && (this.currentCache || this.queue.push(this.queueName)))) return this;
		this._promise = new Promise(async (resolve, reject) => {
			try {
				if (this.params.file) {
					const data = this.params.file;
					const chunkSize = this.params.fileSizeChunk ? this.params.fileSizeChunk * 1024 * 1024 : this.params.file.byteLength;
					const totalChunks = Math.ceil(this.params.file.byteLength / chunkSize);
					const fileId = `file-${new Date().getTime()}`;

					for (let i = 0; i < totalChunks; i++) {
						
						const start = i * chunkSize;
						const end = Math.min(start + chunkSize, data.byteLength);
						const chunk = data.slice(start, end);

						const formData = new FormData();
						formData.append("file", new Blob([chunk]));
						formData.append("file_id", fileId);
						formData.append("chunk_index", String(i));
						formData.append("total_chunks", String(totalChunks));
						const headers: TRequestHeaders = {
							...this.requestParams.headers
						};

						delete headers['Accept'];
						delete headers['Content-Type'];
						
						await (new Http(this.method, {
							...this.params,
							file: undefined,
							headers,
							data: undefined,
							fileSizeChunk: undefined,
							body: formData,
							success: (totalChunks - 1 > i) ? undefined : (data) => {
								resolve(data);
								this.success(data);
							},
							fail: reject,
							error: reject
						}, this)).request(true).promise;
					}
					return;
				}

				const xhr = new XMLHttpRequest();
				
				xhr.open(this.method, this.config.host + this.path, true);
				for(const header in this.requestParams.headers) {
					xhr.setRequestHeader(header, this.requestParams.headers[header]);
				}
	
				if (xhr.upload) {
					xhr.upload.onprogress = ({lengthComputable, loaded, total}) => {
						if (lengthComputable) {
							this.progress({
								percent: (loaded / total * 100),
								total,
								loaded
							});
						}
					}
				}
	
				xhr.onabort = () => {
					reject({
						type: 'abort',
						message: 'request abort'
					});
					this.fail({
						message: 'request abort'
					});
				};
	
				xhr.onerror = () => {
					reject({
						type: 'error',
						message: 'request error'
					});
					this.error({
						message: 'request error'
					});
				};
	
				xhr.onreadystatechange = () => {
					if (xhr.readyState !== 4) return;
					
					const result = (!this.requestParams.withoutResponse && this.isJsonString(xhr.responseText)) ? this.jsonParse(xhr.responseText) : {};
	
					if (xhr.status >= 200 && xhr.status <= 299) {
						if (this.params.cache) {
							this.setCache(this.cacheIndex, result, (typeof this.params.cache === 'boolean' ? undefined : this.params.cache));
						}
						resolve(result);
						this.success(result);
					}else{
						if (xhr.status >= 400 && xhr.status <= 499) {
							reject(result);
							this.fail(result);
						}else{
							reject(result);
							this.error(result);
						}
					}
					this.complete(result);
					this.queue.clear(this.queueName);
				}
				xhr.send(this.requestParams.body);
			}catch(e) {
				reject(e);
				throw e;
			}
		});
		
		return this
	}

	public addHeader(key: string, value: string): this {
		this.requestParams.headers = {...this.requestParams.headers, [key]: value};
		return this;
	}

	public addListener<EVENT extends keyof TListenerEvents, DATA extends TListenerEvents[EVENT]>(event: EVENT, callback: (data: DATA) => void): EventListener {
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