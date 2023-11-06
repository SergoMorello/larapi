import EventEmitter,{
	Events
} from 'easy-event-emitter';
import type {
	TCache,
	TCacheBody,
	TData,
	TGroupsData
} from './types';

abstract class Core {
	private cache: TCache;
		initData: TGroupsData;
	protected events: Events;
		host: string;
		

	constructor(context?: Core) {
		this.events = new EventEmitter();
		this.host = 'http://127.0.0.1/';
		this.cache = {};
		this.initData = {};

		this.setHost = this.setHost.bind(this);
		this.setInitData = this.setInitData.bind(this);
		this.clearCacheGroup = this.clearCacheGroup.bind(this);
		Object.assign(this, context);
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

	public setHost(host: string): void {
		this.host = host;
	}

	protected setCache(key: string, data: TData, group?: string): void {
		this.cache[key] = {
			time: (new Date()).getTime(),
			data: data,
			group: group
		};
	}

	public clearCacheGroup(group: string, data?: TData, fieldKey: string | null = 'id'): void {
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
	}

	public updateCacheGroup(group: string, data: TData, fieldKey: string | null = 'id'): void {

		const update = (cacheData: any) => {
			const retData = cacheData;
			
			const fieldList = fieldKey!.split('.');
			if (fieldList.length > 1) {
				for(const key of fieldList) {
					cacheData = cacheData[key]
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

		for(const key in this.cache) {
			if (this.cache[key].group === group) {
				if (Array.isArray(this.cache[key].data)) {
					this.cache[key].data = Object.values(this.cache[key].data).map(update);
				}else{
					this.cache[key].data = update(this.cache[key].data);
				}
			}
		}
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