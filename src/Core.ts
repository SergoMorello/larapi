import EventEmitter,{
	Events
} from 'easy-event-emitter';
import type {
	TConfig,
	TCache,
	TCacheBody,
	TData,
	TGroupsData
} from './types';

abstract class Core {
	private cache: TCache;
		initData: TGroupsData;
	protected readonly events: Events;
		config: TConfig;
		

	constructor(context?: Core) {
		this.events = new EventEmitter();
		this.config = {
			host: 'http://127.0.0.1/'
		};
		this.cache = {};
		this.initData = {};

		this.setConfig = this.setConfig.bind(this);
		this.setHost = this.setHost.bind(this);
		this.setInitData = this.setInitData.bind(this);
		this.triggerByCacheGroup = this.triggerByCacheGroup.bind(this);
		this.clearCacheGroup = this.clearCacheGroup.bind(this);
		this.updateCacheGroup = this.updateCacheGroup.bind(this);
		if (context) {
			Object.assign(this, {
				config: context?.config,
				events: context?.events,
				cache: context?.cache,
				initData: context?.initData
			});
		}
	}

	protected setConfig(config: TConfig) {
		this.config = config;
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

	protected jsonParse(str: string) {
		if (typeof this.config.dataReplaceCallback === 'function') {
			return JSON.parse(str, this.config.dataReplaceCallback);
		}

		if (this.config.dataReplace) {
			const replace = this.config.dataReplace;
			return JSON.parse(str, (key, value) => {
				if (key === "createdAt" || key === "updatedAt") {
					return new Date(value);
				}
				if (key in replace && typeof replace[key] === 'function') {
					return replace[key](value);
				}
				return value;
			});
		}
		
		return JSON.parse(str);
	}

	public setHost(host: string): void {
		this.config.host = host;
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

	public setInitData(data: TGroupsData): void {
		this.initData = data;
	}
}

export default Core;