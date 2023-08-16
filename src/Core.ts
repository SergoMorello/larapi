//@ts-ignore
import md5 from 'md5';
import EventEmitter,{
	Events,
	Event
} from 'easy-event-emitter';
import {
	TCache,
	TData,
	TGroupsData,
	TMethod,
	TParams,
	TRequestParams,
	TListenerEvents
} from './types';

abstract class Core {
	private host: string;
		token: string;
		cache: TCache;
		initData: TGroupsData;
	protected events: Events;

	constructor() {
		this.events = new EventEmitter();
		this.host = 'http://127.0.0.1/';
		this.token = '';
		this.cache = {};
		this.initData = {};

		this.request = this.request.bind(this);
		this.setHost = this.setHost.bind(this);
		this.addListener = this.addListener.bind(this);
		this.setInitData = this.setInitData.bind(this);
	}

	protected request(method: TMethod, params: TParams) {
		if (typeof XMLHttpRequest === 'undefined') return;

		//Заголовки от 200 до 299
		const success = (...args: any) => {
			if (typeof params.success === 'function')
				params.success(...args);
		};

		//Заголовки от 400 до 499
		const fail = (...args: any) => {
			if (typeof params.fail === 'function') {
				params.fail(...args);
			}
			
			this.events.emit('api-request-fail', args);
		};

		//Все остальные
		const error = (...args: any) => {
			if (typeof params.error === 'function') {
				params.error(...args);
			}
			
			this.events.emit('api-request-error', args);
		};

		const complete = (...args: any) => {
			if (typeof params.complete === 'function') {
				params.complete(...args);
			}	

			this.events.emit('api-request-complete', args);
		};

		const encodeUrlParams = (data: TData) => {
			return Object.keys(data).map(function(k) {
				return encodeURIComponent(k) + "=" + encodeURIComponent(data[k]);
			}).join('&');
		};

		const cuteUndifinedParams = (data: TData) => {
			if (typeof data !== 'object') {
				return;
			}
			for(const key in data) {
				if (!data[key]) {
					delete data[key];
				}
			}
			return data;
		};

		var path = params.path;
		const fetchParams: TRequestParams = {
			method: method
		};

		fetchParams.headers = {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + this.token
		};

		params.data = params.data ? cuteUndifinedParams(params.data) : params.data;

		if (method === 'POST') {
			fetchParams.body = JSON.stringify(params.data);
		}

		if (method === 'GET') {
			if (params.data)
				path = params.path + '?' + encodeUrlParams(params.data);
		}
		const pathCache = md5(path + JSON.stringify(params.data));
		var dataCache;

		if (params.globalName) {
			if (this.initData[params.globalName]) {
				this.setCache(pathCache, this.initData[params.globalName], (typeof params.cache === 'boolean' ? undefined : params.cache));
				params.cache = params.cache ?? true;
				delete this.initData[params.globalName];
			}
		}
		
		if (params.cache) {
			if (dataCache = this.getCache(pathCache)) {
				success(dataCache);
				complete(dataCache);
			}	
		}else{
			this.deleteCache(pathCache);
		}
		if (!dataCache) {
			try {
				const xhr = new XMLHttpRequest();

				xhr.open(method, this.host + path, true);
				for(const header in fetchParams.headers) {
					xhr.setRequestHeader(header, fetchParams.headers[header]);
				}
	
				xhr.onreadystatechange = () => {
					if (xhr.readyState !== 4) {
						return;
					}
					
					const result = xhr.responseText ? JSON.parse(xhr.responseText) : {};
	
					if (xhr.status >= 200 && xhr.status <= 299) {
						if (params.cache) {
							this.setCache(pathCache, result, (typeof params.cache === 'boolean' ? undefined : params.cache));
						}
						success(result);
					}else{
						if (xhr.status >= 400 && xhr.status <= 499) {
							fail(result);
						}
						
						error(result);
						console.warn(result);
					}
					complete(result);
				}
				xhr.send(fetchParams.body);
			}catch(e) {
				console.warn(e);
			}
			
		}
		return {
			clearCache: () => {
				this.deleteCache(pathCache);
			}
		}
	}

	public addListener(event: TListenerEvents, callback: (data: any) => void): Event {
		return this.events.addListener(event, callback);
	}

	private getCache(request: string): TData | undefined {
		const key = md5(request);
		if (this.cache[key]) {
			if ((new Date()).getTime() <= (this.cache[key].time + 3600000000)) {
				return this.cache[key].data;
			}else{
				delete this.cache[key];
			}
		}
	}

	public setHost(host: string): void {
		this.host = host;
	}

	private setCache(request: string, data: TData, group?: string): void {
		this.cache[md5(request)] = {
			time: (new Date()).getTime(),
			data: data,
			group: group
		};
	}

	public deleteCacheGroup(group: string): void {
		for(const key in this.cache) {
			if (this.cache[key].group === group) {
				delete this.cache[key];
			}
		}
	}

	private deleteCache(request: string): void {
		const keyCache = md5(request);
		if (!this.cache[keyCache])
			return;

		const group = this.cache[keyCache].group;
		if (group) {
			this.deleteCacheGroup(group);
		}
		delete this.cache[keyCache];
	}

	public setInitData(data: TGroupsData): void {
		this.initData = data;
	}
}

export default Core;