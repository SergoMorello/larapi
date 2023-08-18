//@ts-ignore
import md5 from 'md5';
import Core from "./Core";
import {
	TMethod,
	TParams,
	TData,
	TRequestParams
} from "./types";

class Http extends Core {
	private cacheIndex: string;
		method: TMethod;
		params: TParams;

	constructor(method: TMethod, params: TParams, context?: Core) {
		super(context);
		this.cacheIndex = '';
		this.method = method;
		this.params = params;
		
		this.success = this.success.bind(this);
		this.fail = this.fail.bind(this);
		this.error = this.error.bind(this);
		this.complete = this.complete.bind(this);
		this.request = this.request.bind(this);
	}

	//Заголовки от 200 до 299
	private success(...args: any) {
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
	}

	//Заголовки от 400 до 499
	private fail(...args: any) {
		if (typeof this.params.fail === 'function') {
			this.params.fail(...args);
		}
		
		this.events.emit('api-request-fail', args);
	}

	//Все остальные
	private error(...args: any) {
		if (typeof this.params.error === 'function') {
			this.params.error(...args);
		}
		
		this.events.emit('api-request-error', args);
	}

	private complete(...args: any) {
		if (typeof this.params.complete === 'function') {
			this.params.complete(...args);
		}	

		this.events.emit('api-request-complete', args);
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
		if (typeof XMLHttpRequest === 'undefined') return this;

		var path = this.params.path;
		const fetchParams: TRequestParams = {
			method: this.method
		};

		fetchParams.headers = {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + this.token
		};

		this.params.data = this.params.data ? this.cuteUndifinedParams(this.params.data) : this.params.data;

		if (this.method === 'POST') {
			fetchParams.body = JSON.stringify(this.params.data);
		}

		if (this.method === 'GET') {
			if (this.params.data)
				path = this.params.path + '?' + this.encodeUrlParams(this.params.data);
		}

		this.cacheIndex = md5(path + JSON.stringify(this.params.data));

		var dataCache;

		if (this.params.globalName) {
			if (this.initData[this.params.globalName]) {
				this.setCache(this.cacheIndex, this.initData[this.params.globalName], (typeof this.params.cache === 'boolean' ? undefined : this.params.cache));
				this.params.cache = this.params.cache ?? true;
				delete this.initData[this.params.globalName];
			}
		}
		
		if (this.params.cache) {
			if (dataCache = this.getCache(this.cacheIndex)) {
				this.success(dataCache);
				this.complete(dataCache);
			}	
		}else{
			this.deleteCache(this.cacheIndex);
		}
		if (!dataCache) {
			try {
				const xhr = new XMLHttpRequest();

				xhr.open(this.method, this.host + path, true);
				for(const header in fetchParams.headers) {
					xhr.setRequestHeader(header, fetchParams.headers[header]);
				}
	
				xhr.onreadystatechange = () => {
					if (xhr.readyState !== 4) {
						return;
					}
					
					const result = this.isJsonString(xhr.responseText) ? JSON.parse(xhr.responseText) : {};
	
					if (xhr.status >= 200 && xhr.status <= 299) {
						if (this.params.cache) {
							this.setCache(this.cacheIndex, result, (typeof this.params.cache === 'boolean' ? undefined : this.params.cache));
						}
						this.success(result);
					}else{
						if (xhr.status >= 400 && xhr.status <= 499) {
							fail(result);
						}
						
						this.error(result);
						console.warn(result);
					}
					this.complete(result);
				}
				xhr.send(fetchParams.body);
			}catch(e) {
				console.warn(e);
			}
		}
		return this
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