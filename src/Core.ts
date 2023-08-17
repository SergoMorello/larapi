//@ts-ignore
import md5 from 'md5';
import EventEmitter,{
	Events,
	Event
} from 'easy-event-emitter';
// import ApiRequest from './ApiRequest';
import {
	TCache,
	TData,
	TGroupsData,
	TListenerEvents
} from './types';

abstract class Core {
	private cache: TCache;
		initData: TGroupsData;
	protected events: Events;
		host: string;
		token: string;

	constructor(context?: Core) {
		this.events = new EventEmitter();
		this.host = 'http://127.0.0.1/';
		this.token = '';
		this.cache = {};
		this.initData = {};

		this.setHost = this.setHost.bind(this);
		this.addListener = this.addListener.bind(this);
		this.setInitData = this.setInitData.bind(this);
		this.deleteCacheGroup = this.deleteCacheGroup.bind(this);
		Object.assign(this, context);
	}

	public addListener(event: TListenerEvents, callback: (data: any) => void): Event {
		return this.events.addListener(event, callback);
	}

	protected getCache(request: string): TData | undefined {
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

	protected setCache(request: string, data: TData, group?: string): void {
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

	protected deleteCache(request: string): void {
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