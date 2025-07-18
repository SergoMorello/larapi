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
	private _promise: Promise<DATA>;
	private xhr?: XMLHttpRequest;
	private tryRequestCount = 0;
	private tryRequestTimeout?: NodeJS.Timeout;

	constructor(method: TMethod, params: TParams<PATH, DATA>, context?: Core) {
		super(context);
		this.currentEvents = new EventEmitter();
		this._promise = new Promise<DATA>(() => {});
		this.queue = new Queue<D>(this);
		this.cacheIndex = '';
		this.queueName = '';
		this.method = method;
		this.params = {
			...this.config,
			...params
		};
		this.path = this.params.path as string;
		this.requestParams = {
			method: this.method
		};

		this.requestParams.headers = {
			...this.params.headers
		};
		
		this.handleSuccess = this.handleSuccess.bind(this);
		this.handleAbort = this.handleAbort.bind(this);
		this.handleFail = this.handleFail.bind(this);
		this.handleError = this.handleError.bind(this);
		this.handleComplete = this.handleComplete.bind(this);
		this.handleProgress = this.handleProgress.bind(this);
		this.setEmit = this.setEmit.bind(this);
		this.request = this.request.bind(this);
		this.addHeader = this.addHeader.bind(this);
		this.deleteHeader = this.deleteHeader.bind(this);
		this.httpRequest = this.httpRequest.bind(this);
		this.tryHttpRequest = this.tryHttpRequest.bind(this);

		this.initRequest();
		this.initCache();
		this.initQueue();
	}

	private initRequest(): void {
		
		if (typeof XMLHttpRequest !== 'undefined') {
			this.xhr = new XMLHttpRequest();
		}
		
		if (this.params.clearUndifinedData)
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
			this._promise = new Promise(async (resolve) => {
				if (this.currentCache = this.getCache(this.cacheIndex)) {
					resolve(this.currentCache as DATA);
					this.handleSuccess(this.currentCache);
					this.handleComplete(this.currentCache);
				}
			});
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
	public handleSuccess(data: any) {
		if (typeof this.params.success === 'function' && this.xhr)
			this.params.success(data, this.xhr);
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

	public handleAbort(data: any) {
		if (typeof this.params.abort === 'function') {
			this.params.abort(data);
		}
		
		this.setEmit('api-request-abort', data);
	}

	//Заголовки от 400 до 499
	public handleFail(data: any) {
		if (typeof this.params.fail === 'function') {
			this.params.fail(data);
		}
		
		this.setEmit('api-request-fail', data);
	}

	//Все остальные
	public handleError(data: any) {
		if (this.xhr?.status === 0 && this.xhr.readyState === 4) {
			return;
		}
		if (typeof this.params.error === 'function') {
			this.params.error(data);
		}
		
		this.setEmit('api-request-error', data);
	}

	public handleComplete(data: any) {
		if (typeof this.params.complete === 'function') {
			this.params.complete(data);
		}	

		this.setEmit('api-request-complete', data);
	}

	public handleProgress(progress: TRequestProgress) {
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
			if (typeof data[key] === 'undefined') {
				delete data[key];
			}
		}
		return data;
	}

	private tryHttpRequest() {
		return new Promise((resolve, reject) => {
			if (this.params.tryRequest && this.params.tryRequest > this.tryRequestCount) {
				if (this.tryRequestTimeout) {
					clearTimeout(this.tryRequestTimeout);
				}
				this.tryRequestTimeout = setTimeout(() => {
					this.xhr?.abort();
					this.httpRequest()
					.then((value) => {
						resolve(value);
						this.tryRequestCount = 0;
					})
					.catch(reject);
				}, this.params.tryRequestDelay ?? 1000);
				++this.tryRequestCount;
			}else{
				reject();
			}
		})
	}

	private fileRequest() {
		return new Promise(async (resolve, reject) => {
			if (!this.params.file) return;

			const data = this.params.file;
			const chunkSize = this.params.fileSizeChunk ? this.params.fileSizeChunk * 1024 * 1024 : this.params.file.byteLength;
			const totalChunks = Math.ceil(this.params.file.byteLength / chunkSize);
			let fileId: string | undefined = this.params.fileIdByServer ? undefined : `file-${new Date().getTime()}`;
			
			for (let i = 0; i < totalChunks; i++) {
				try {
					const start = i * chunkSize;
					const end = Math.min(start + chunkSize, data.byteLength);
					const chunk = data.slice(start, end);

					const formData = new FormData();
					formData.append("file", new Blob([chunk]));
					if (fileId && (!this.params.fileIdByServer || (this.params.fileIdByServer && i > 0))) {
						formData.append(typeof this.params.fileIdByServer === 'string' ? this.params.fileIdByServer : "file_id", fileId);
					}
					formData.append("chunk_index", String(i));
					formData.append("total_chunks", String(totalChunks));

					if (this.params.data && (totalChunks - 1) === i) {
						for (const key in this.params.data) {
							formData.append(key, this.params.data[key]);
						}
					}
					
					const headers: TRequestHeaders = {
						...this.requestParams.headers
					};

					delete headers['Accept'];
					delete headers['Content-Type'];

					const http = new Http(this.method, {
						...this.params,
						file: undefined,
						headers,
						data: undefined,
						fileSizeChunk: undefined,
						body: formData,
						success: (totalChunks - 1 > i) ? undefined : (data) => {
							resolve(data);
							this.handleSuccess(data);
						},
						progress: (progres) => {
							const loaded = start + progres.loaded;
							this.handleProgress({
								percent: (loaded / data.byteLength * 100),
								total: data.byteLength,
								loaded
							});
						},
						fail: reject,
						error: reject
					}, this);

					this.xhr = http.xhr;
				
					const result = await http.request(true).promise;
					if (result?.file_id) {
						fileId = result?.file_id;
					}
				}catch(e){
					break;
				}
			}
		})
	}

	private httpRequest() {
		return new Promise((resolve, reject) => {
			if (typeof this.xhr === 'undefined') return;
			try {
				this.xhr.open(this.method, this.params.host + this.path, true);

				if (this.params.timeout) {
					this.xhr.timeout = this.params.timeout;
				}

				for(const header in this.requestParams.headers) {
					this.xhr.setRequestHeader(header, this.requestParams.headers[header]);
				}

				if (this.xhr.upload) {
					this.xhr.upload.onprogress = ({lengthComputable, loaded, total}) => {
						if (lengthComputable) {
							this.handleProgress({
								percent: (loaded / total * 100),
								total,
								loaded
							});
						}
					}
				}

				this.xhr.onabort = () => {
					reject({
						type: 'abort',
						message: 'request abort'
					});
					this.handleAbort({
						message: 'request abort'
					});
				};

				this.xhr.ontimeout = () => {
					this.tryHttpRequest()
					.then(resolve)
					.catch(reject);
				};

				this.xhr.onerror = async () => {
					await this.tryHttpRequest()
						.then(resolve)
						.catch(reject);
					reject({
						type: 'error',
						message: 'request error'
					});
					this.handleError({
						message: 'request error'
					});
				};
				
				this.xhr.onreadystatechange = () => {
					if (this.xhr?.readyState !== XMLHttpRequest.DONE) return;

					const result = (!this.requestParams.withoutResponse && this.isJsonString(this.xhr.responseText)) ? this.jsonParse(this.xhr.responseText) : {};

					if (this.xhr?.status >= 200 && this.xhr.status <= 299) {
						if (this.params.cache) {
							this.setCache(this.cacheIndex, result, (typeof this.params.cache === 'boolean' ? undefined : this.params.cache));
						}
						resolve(result);
						this.handleSuccess(result);
					}else{
						if (this.xhr.status >= 100 && this.xhr.status <= 500) {
							reject(result);
							this.handleFail(result);
						}
					}
					this.handleComplete(result);
					this.queue.clear(this.queueName);
				}
				this.xhr.send(this.requestParams.body);
			}catch(e) {
				reject(e);
			}
		});
	}
	
	private streamRequest() {
		return new Promise((resolve, reject) => {
			fetch(this.params.host + this.path, {
				method: this.method,
				headers: this.requestParams.headers,
				body: this.requestParams.body,
			}).then((response) => {
				this.handleSuccess(response);
				resolve(response);
			}).catch((e) => {
				this.handleFail(e);
				reject(e)
			});
		});
	}

	public request(force?: boolean): this {

		if (!force && !this.params.forceRequest && (this.currentCache || this.queue.push(this.queueName))) return this;
		this._promise = new Promise(async (resolve, reject) => {
			try {
				let result;
				if (this.params.stream) {
					result = await this.streamRequest() as DATA;
				}else if (this.params.file) {
					result = await this.fileRequest() as DATA;
				}else{
					result = await this.httpRequest() as DATA;
				}
				resolve(result);
			}catch(e) {
				reject(e);
			}
		});
		
		return this
	}

	public abort() {
		this.xhr?.abort();
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