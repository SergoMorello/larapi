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
	ObjectReviverRule,
	ReviverObject,
	ObjectCondition
} from './types';

const MAX_REVIVER_DEPTH = 100;

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

	

	private hasOwn(value: object, key: string): boolean {
		return Object.prototype.hasOwnProperty.call(value, key);
	}
	private isPlainObject(value: unknown): value is ReviverObject {
		if (value === null || typeof value !== 'object') {
			return false;
		}

		const prototype = Object.getPrototypeOf(value);

		return prototype === Object.prototype || prototype === null;
	};

	private parseConditionValue = (value: string): unknown => {
		try {
			return JSON.parse(value);
		} catch {
			return value;
		}
	};

	private compileCondition = (expression: string): ObjectCondition => {
		const match = expression.match(
			/^([^\s=!<>]+)\s*(>=|<=|!=|=|>|<)\s*(.*)$/
		);

		if (!match) {
			if (!expression || /[\s=!<>]/.test(expression)) {
				throw new Error(
					`Некорректное условие reviver: "${expression}"`
				);
			}

			return value => this.hasOwn(value, expression);
		}

		const [, key, operator, rawValue] = match;
		const expected = this.parseConditionValue(rawValue.trim());

		if (operator === '=') {
			return value =>
				this.hasOwn(value, key) &&
				value[key] === expected;
		}

		if (operator === '!=') {
			return value =>
				this.hasOwn(value, key) &&
				value[key] !== expected;
		}

		if (typeof expected !== 'number' || !Number.isFinite(expected)) {
			throw new Error(
				`Для оператора "${operator}" требуется число: "${expression}"`
			);
		}

		let compare: (actual: number) => boolean;

		switch (operator) {
			case '>':
				compare = actual => actual > expected;
				break;

			case '>=':
				compare = actual => actual >= expected;
				break;

			case '<':
				compare = actual => actual < expected;
				break;

			case '<=':
				compare = actual => actual <= expected;
				break;

			default:
				throw new Error(`Неизвестный оператор: "${operator}"`);
		}

		return value => {
			if (!this.hasOwn(value, key)) {
				return false;
			}

			const actual = value[key];

			return typeof actual === 'number' && compare(actual);
		};
	};

	private compileRevivers() {
		const fieldRevivers: FieldRevivers = {};
		const objectRevivers: ObjectReviverRule[] = [];

		const replace = this.config.dataReviver;

		if (!replace) {
			return { fieldRevivers, objectRevivers };
		}

		for (const [rawKey, fn] of Object.entries(replace)) {
			if (typeof fn !== 'function') {
				continue;
			}

			const key = rawKey.trim();

			if (!key) {
				throw new Error('Ключ reviver не может быть пустым');
			}

			if (/[&=!<>]/.test(key)) {
				objectRevivers.push({
					conditions: key.split('&').map(part =>
						this.compileCondition(part.trim())
					),
					fn
				});
			} else {
				fieldRevivers[key] = fn;
			}
		}

		return { fieldRevivers, objectRevivers };
	}

	private applyObjectRevivers(
		value: unknown,
		objectRevivers: ObjectReviverRule[],
		shallow = false
	): unknown {
		if (objectRevivers.length === 0) {
			return value;
		}

		const visited = new WeakMap<object, unknown>();
		let depthWarningShown = false;

		const visit = (current: unknown, depth: number): unknown => {
			if (current === null || typeof current !== 'object') {
				return current;
			}

			if (visited.has(current)) {
				return visited.get(current);
			}

			const isArray = Array.isArray(current);

			if (!isArray && !this.isPlainObject(current)) {
				return current;
			}

			if (depth > MAX_REVIVER_DEPTH) {
				if (!depthWarningShown) {
					depthWarningShown = true;

					console.warn(
						`[dataReviver] max depth exceeded: ` +
						`${MAX_REVIVER_DEPTH}. Deeper values are ` +
						`returned without processing.`
					);
				}

				return current;
			}

			visited.set(current, current);

			if (isArray) {
				// В поверхностном режиме обходим только корневой массив.
				if (!shallow || depth === 0) {
					for (let i = 0; i < current.length; i++) {
						current[i] = visit(current[i], depth + 1);
					}
				}

				return current;
			}

			const object = current as ReviverObject;

			if (!shallow) {
				for (const key of Object.keys(object)) {
					object[key] = visit(object[key], depth + 1);
				}
			}

			let result: unknown = object;

			for (const rule of objectRevivers) {
				if (!this.isPlainObject(result)) {
					break;
				}

				let match = true;

				for (const condition of rule.conditions) {
					if (!condition(result)) {
						match = false;
						break;
					}
				}

				if (match) {
					result = rule.fn(result);
				}
			}

			visited.set(current, result);

			return result;
		};

		return visit(value, 0);
	}


	public dataPrepare(data: unknown) {
		const json = JSON.stringify(data);
		return this.jsonParse(json);
	}

	public jsonParse(str: string) {
		if (typeof this.config.reviver === 'function') {
			return JSON.parse(str, this.config.reviver);
		}

		const { fieldRevivers, objectRevivers } = this.compileRevivers();

		const data = JSON.parse(str, (key, value) => {
			const reviver = fieldRevivers[key];
			return reviver ? reviver(value) : value;
		});

		return this.applyObjectRevivers(data, objectRevivers, !this.config.reviverDepth);
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