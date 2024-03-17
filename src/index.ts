import Core from "./Core";
import type {
	TConfig,
	TMethod,
	TParams,
	TResolveData,
	TListenerEvents
} from "./types";
import type {
	Event
} from "easy-event-emitter";
import Http from "./Http";

type TUser = {
	id: number;
	[index: string]: any;
};

/** Laravel API Client */
class API<DATA extends TResolveData = TResolveData, USER extends TUser = TUser> extends Core {
	private static instance = new API({
		host: ''
	});
	private _user: USER;
		token?: string;

	constructor(config: TConfig) {
		super();
		this.setConfig(config);
		this._user = {} as USER;

		this.setToken = this.setToken.bind(this);
		this.setUser = this.setUser.bind(this);
		this.updateUser = this.updateUser.bind(this);
		this.logout = this.logout.bind(this);
		this.getToken = this.getToken.bind(this);
		this.http = this.http.bind(this);
		this.get = this.get.bind(this);
		this.head = this.head.bind(this);
		this.post = this.post.bind(this);
		this.put = this.put.bind(this);
		this.patch = this.patch.bind(this);
		this.delete = this.delete.bind(this);
		this.options = this.options.bind(this);
		this.connect = this.connect.bind(this);
		this.trace = this.trace.bind(this);
		this.getUid = this.getUid.bind(this);
		this.getUser = this.getUser.bind(this);
		this.addListener = this.addListener.bind(this);
	}

	public http(method: TMethod, params: TParams<DATA>) {
		const http = new Http<DATA>(method, params, this);
		if (this.token) {
			http.addHeader('Authorization', 'Bearer ' + this.token);
		}
		return http;
	}

	public get(params: TParams<DATA>) {
		return this.http('GET', params).request();
	}

	public head(params: TParams<DATA>) {
		return this.http('HEAD', params).request();
	}

	public post(params: TParams<DATA>) {
		return this.http('POST', params).request();
	}

	public put(params: TParams<DATA>) {
		return this.http('PUT', params).request();
	}

	public patch(params: TParams<DATA>) {
		return this.http('PATCH', params).request();
	}

	public delete(params: TParams<DATA>) {
		return this.http('DELETE', params).request();
	}

	public options(params: TParams<DATA>) {
		return this.http('OPTIONS', params).request();
	}

	public connect(params: TParams<DATA>) {
		return this.http('CONNECT', params).request();
	}

	public trace(params: TParams<DATA>) {
		return this.http('TRACE', params).request();
	}

	public addListener(event: TListenerEvents, callback: (data: any) => void): Event {
		return this.events.addListener(event, callback);
	}

	public async setToken(token: string) {
		this.token = token;
	}

	public getToken() {
		return this.token;
	}

	public getUid(): number {
		return (typeof this._user === 'object' && 'id' in this._user) ? Number(this._user.id) : 0;
	}

	public getUser(): USER {
		return this._user;
	}

	public get uid(): number {
		return this.getUid();
	}

	public get user(): USER {
		return this.getUser();
	}

	public async setUser(user: USER) {
		this._user = user;
		this.events.emit('login', user);
	}

	public updateUser(user: USER) {
		const updatedUser = {...this.user, ...user};
		this.setUser(updatedUser);
		this.events.emit('user-update', updatedUser);
	}

	public async logout() {
		const user = this.user;
		this.setUser({} as USER);
		this.setToken('');
		this.events.emit('logout', user);
	}

	public static http = this.instance.http;
	public static get = this.instance.get;
	public static head = this.instance.head;
	public static post = this.instance.post;
	public static put = this.instance.put;
	public static patch = this.instance.patch;
	public static delete = this.instance.delete;
	public static options = this.instance.options;
	public static connect = this.instance.connect;
	public static trace = this.instance.trace;
	public static setConfig = this.instance.setConfig;
	public static setHost = this.instance.setHost;
	public static setUser = this.instance.setUser;
	public static updateUser = this.instance.updateUser;
	public static logout = this.instance.logout;
	public static setToken = this.instance.setToken;
	public static addListener = this.instance.addListener;
	public static setInitData = this.instance.setInitData;
	public static triggerByCacheGroup = this.instance.triggerByCacheGroup;
	public static clearCacheGroup = this.instance.clearCacheGroup;
	public static updateCacheGroup = this.instance.updateCacheGroup;
	public static getToken = this.instance.getToken;
	public static getUid = this.instance.getUid;
	public static getUser = this.instance.getUser;
	public static user = this.instance.user;
	public static uid = this.instance.uid;

	/**
	 * @deprecated The method should not be used
	 */
	public static deleteCacheGroup = this.instance.clearCacheGroup;
}

(globalThis as any).apiSetInitData = API.setInitData;
export type {
	/**
	 * @deprecated The type should not be used
	 */
	Event,
	Event as EventListener
};
export default API;