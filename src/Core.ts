import EventEmitter,{
	Events
} from 'easy-event-emitter';
import type {
	TConfig,
	TCache,
	TCacheBody,
	TData,
	TGroupsData,
	TCoreRviverObject,
	TRequestHeaders,
	FieldRevivers,
	ObjectReviverRule
} from './types';

abstract class Core {
	private cache: TCache;
		initData: TGroupsData;
	protected readonly events: EventEmitter;
	protected config: TConfig;
	protected headers: TRequestHeaders = {};
		
	constructor(context?: Core) {
		this.events = new EventEmitter();
		this.config = {
			host: 'http://127.0.0.1/',
		};
		this.cache = {};
		this.initData = {};

		this.setConfig = this.setConfig.bind(this);
		this.getConfig = this.getConfig.bind(this);
		this.setHost = this.setHost.bind(this);
		this.setInitData = this.setInitData.bind(this);
		this.triggerByCacheGroup = this.triggerByCacheGroup.bind(this);
		this.clearCacheGroup = this.clearCacheGroup.bind(this);
		this.updateCacheGroup = this.updateCacheGroup.bind(this);
		this.setGlobalInitData = this.setGlobalInitData.bind(this);
		if (context) {
			Object.assign(this, {
				config: context?.config,
				events: context?.events,
				cache: context?.cache,
				initData: context?.initData,
				headers: context.headers
			});
		}
	}

	protected setConfig(config: TConfig) {
		this.config = config;
	}

	protected getConfig() {
		return this.config;
	}

	protected getCache(key: string): TData | undefined {
		if (this.cache[key]) {
			if ((new Date()).getTime() <= (this.cache[key].time + 3600000000)) {
				return this.cache[key].data;
			}else{
				delete this.cache[key];
			}
		}
	}

	protected isJsonString(str: string) {
		try {
			JSON.parse(str);
		} catch (e) {
			return false;
		}
		return true;
	}

	private compileRevivers() {
		const fieldRevivers: FieldRevivers = {};
		const objectRevivers: ObjectReviverRule[] = [];

		const replace = this.config.dataReviver;
		if (!replace) return { fieldRevivers, objectRevivers };

		for (const [key, fn] of Object.entries(replace)) {
			if (typeof fn !== 'function') continue;

			if (key.includes('&')) {
				objectRevivers.push({
					keys: new Set(key.split('&')),
					fn
				});
			} else {
				fieldRevivers[key] = fn;
			}
		}

		return { fieldRevivers, objectRevivers };
	}

	public dataPrepare(data: unknown) {
		const json = JSON.stringify(data);
		return this.jsonParse(json);
	}

	public jsonParse(str: string) {
		// 1. стандартный reviver — сразу выходим
		if (typeof this.config.reviver === 'function') {
			return JSON.parse(str, this.config.reviver);
		}

		const { fieldRevivers, objectRevivers } = this.compileRevivers();

		// 2. парсим ОДИН раз
		const data = JSON.parse(str, (key, value) => {
			const reviver = fieldRevivers[key];
			return reviver ? reviver(value) : value;
		});

		// 3. объектные правила
		if (
			data &&
			typeof data === 'object' &&
			!Array.isArray(data)
		) {
			const keys = Object.keys(data);

			for (const rule of objectRevivers) {
				if (rule.keys.size > keys.length) continue;

				let match = true;
				for (const k of rule.keys) {
					if (!(k in data)) {
						match = false;
						break;
					}
				}

				if (match) {
					return rule.fn(data);
				}
			}
		}

		return data;
	}

	public setHost(host: string): void {
		this.config.host = host;
	}

	public setHeader(name: string, value: string) {
		this.headers[name] = value;
		this.events.emit('header-update', {
			name,
			value
		});
	}

	public getHeader(name: string) {
		return this.headers[name];
	}

	public getHeaders() {
		return Object.entries(this.headers).map(([name, value]) => ({name, value}));
	}

	public hasHeader(name: string) {
		return this.headers[name] ? true : false;
	}

	public deleteHeader(name: string) {
		delete this.headers[name];
	}

	protected setCache(key: string, data: TData, group?: string): void {
		this.cache[key] = {
			time: (new Date()).getTime(),
			data: data,
			group: group
		};
	}

	protected groupFromArray<T = string>(groups: T | T[], callback: (group: T, params?: string[]) => void, withoutSplit: boolean = false): void {
		const currentCallback = (group: T) => {
			if (typeof group === 'string' && !withoutSplit) {
				const params = group.split('.');
				const current = params.shift() as T;
				callback(current, params);
			}else{
				callback(group);
			}
		};

		if (Array.isArray(groups)) {
			groups.map(currentCallback);
		}else if (typeof groups === 'string') {
			currentCallback(groups);
		}
	}

	public triggerByCacheGroup(groups: string | string[]): void {
		this.groupFromArray(groups, (group) => this.events.emit('trigger-request-by-cache-' + group, undefined));
	}

	public clearCacheGroup(groups: string | string[], data?: TData, fieldKey: string | null = 'id'): void {
		this.groupFromArray(groups, (group) => {
			if (data) {

				const clear = (cacheData: any) => {
					if ((fieldKey && cacheData?.[fieldKey] === data?.[fieldKey]) || fieldKey === null) {
						for(const key in cacheData) {
							if (key in data) {
								return false
							}
						}
					}
					return true;
				};
	
	
				for(const key in this.cache) {
					if (this.cache[key].group === group) {
						if (Array.isArray(this.cache[key].data)) {
							this.cache[key].data = Object.values(this.cache[key].data).filter(clear);
						}else{
							if (!clear(this.cache[key].data))
								delete this.cache[key];
						}
					}
				}
			}else{
				for(const key in this.cache) {
					if (this.cache[key].group === group) {
						delete this.cache[key];
					}
				}
			}
		});
	}

	private setDataTree(obj: any, path: string, val: any) { 
		const keys = path.split('.');
		const lastKey = keys.pop();
		const lastObj = keys.reduce((obj, key) => 
			obj[key] = obj[key] || {}, 
			obj);
		if (typeof lastKey === 'string') {
			lastObj[lastKey] = val;
		}
		return obj;
	};

	public updateCacheGroup(groups: string | string[], data: TData, fieldKey: string | null = 'id'): void {
		const update = (cacheData: any) => {
			const retData = cacheData;
			
			const fieldList = fieldKey!.split('.');
			if (fieldList.length > 1) {
				for(const key of fieldList) {
					cacheData = cacheData[key];
				}
			}
			
			if ((fieldKey && cacheData[fieldKey] === data[fieldKey]) || fieldKey === null) {
				for(const key in cacheData) {
					if (key in data) {
						cacheData[key] = data[key];
					}
				}
			}
			return retData;
		};
		
		this.groupFromArray(groups, (group, params) => {
			for(const key in this.cache) {
				if (this.cache[key].group === group) {
					if (Array.isArray(this.cache[key].data)) {
						this.cache[key].data = Object.values(this.cache[key].data).map(update);
					}else{
						this.cache[key].data = update(this.cache[key].data);
					}
				}
			}
		});
	}

	public appendCacheGroup(group: string, data: TData): void {
		

		// for(const key in this.cache) {
		// 	if (this.cache[key].group === group) {
		// 		console.log(this.setDataTree(this.cache[key].data, 'data.test', 'tttttt'));
		// 	}
		// }
		//console.log(this.cache);
	}

	protected getCacheByIndex(index: string): TCacheBody {
		return this.cache[index];
	}

	protected deleteCache(key: string): void {
		if (!this.cache[key])
			return;

		const group = this.cache[key].group;
		if (group) {
			this.clearCacheGroup(group);
		}
		delete this.cache[key];
	}

	public setGlobalInitData(name: string, data: TGroupsData): void {
		this.initData[name] = data;
	}

	public setInitData(data: TGroupsData): void {
		this.initData = data;
	}
}

export default Core;