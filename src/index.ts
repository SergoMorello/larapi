import Core from "./Core";
import type {
	TUser,
	TConfig,
	TMethod,
	TParams,
	TResponseData,
	TListenerEvents,
	TData
} from "./types";
import type {
	EventListener
} from "easy-event-emitter";
import Http from "./Http";


/** Laravel API Client */
class API<D extends TResponseData = TResponseData, U extends TUser = TUser, S extends D['success'] = D['success']> extends Core {
	private static instance = new API({
		host: ''
	});
	private _user: U;
	private token?: string;
	private csrfToken?: string;

	constructor(config: TConfig) {
		super();
		this.setConfig(config);
		this._user = {} as U;

		this.setToken = this.setToken.bind(this);
		this.setCSRFToken = this.setCSRFToken.bind(this);
		this.setLogin = this.setLogin.bind(this);
		this.setUser = this.setUser.bind(this);
		this.updateUser = this.updateUser.bind(this);
		this.logout = this.logout.bind(this);
		this.getToken = this.getToken.bind(this);
		this.getCSRFToken = this.getCSRFToken.bind(this);
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

	public http<DATA extends S[PATH]['?'], PATH extends keyof S = keyof S>(method: TMethod, params: TParams<PATH, DATA>) {
		const http = new Http<D, PATH, DATA>(method, params, this);
		http.addHeader('Accept', 'application/json');
		http.addHeader('Content-Type', 'application/json');
		if (this.token) http.addHeader('Authorization', 'Bearer ' + this.token);
		if (this.csrfToken) http.addHeader('X-CSRF-TOKEN', this.csrfToken);
		return http;
	}

	public get<DATA extends S[PATH]['?'], PATH extends keyof S = keyof S>(params: TParams<PATH, DATA, 'GET'>) {
		return this.http<DATA, PATH>('GET', params).request();
	}

	public head<DATA extends S[PATH]['?'], PATH extends keyof S = keyof S>(params: TParams<PATH, DATA>) {
		return this.http<DATA, PATH>('HEAD', params).request();
	}

	public post<DATA extends S[PATH]['?'], PATH extends keyof S = keyof S>(params: TParams<PATH, DATA>) {
		return this.http<DATA, PATH>('POST', params).request();
	}

	public put<DATA extends S[PATH]['?'], PATH extends keyof S = keyof S>(params: TParams<PATH, DATA>) {
		return this.http<DATA, PATH>('PUT', params).request();
	}

	public patch<DATA extends S[PATH]['?'], PATH extends keyof S = keyof S>(params: TParams<PATH, DATA>) {
		return this.http<DATA, PATH>('PATCH', params).request();
	}

	public delete<DATA extends S[PATH]['?'], PATH extends keyof S = keyof S>(params: TParams<PATH, DATA>) {
		return this.http<DATA, PATH>('DELETE', params).request();
	}

	public options<DATA extends S[PATH]['?'], PATH extends keyof S = keyof S>(params: TParams<PATH, DATA>) {
		return this.http<DATA, PATH>('OPTIONS', params).request();
	}

	public connect<DATA extends S[PATH]['?'], PATH extends keyof S = keyof S>(params: TParams<PATH, DATA>) {
		return this.http<DATA, PATH>('CONNECT', params).request();
	}

	public trace<DATA extends S[PATH]['?'], PATH extends keyof S = keyof S>(params: TParams<PATH, DATA>) {
		return this.http<DATA, PATH>('TRACE', params).request();
	}

	public addListener<EVENT extends keyof TListenerEvents, DATA extends TListenerEvents[EVENT]>(event: EVENT, callback: (data: DATA) => void): EventListener {
		return this.events.addListener(event, callback);
	}

	public setToken(token: string) {
		this.token = token;
		this.events.emit('token-update', token);
	}

	public setCSRFToken(csrfToken: string) {
		this.csrfToken = csrfToken;
		this.events.emit('csrf-token-update', csrfToken);
	}

	public getToken() {
		return this.token;
	}

	public getCSRFToken() {
		return this.csrfToken;
	}

	public getUid(): number {
		return (typeof this._user === 'object' && 'id' in this._user) ? Number(this._user.id) : 0;
	}

	public getUser(): U {
		return this._user;
	}

	public get uid(): number {
		return this.getUid();
	}

	public get user(): U {
		return this.getUser();
	}

	public setLogin(user: U, token: string = '') {
		this.setUser(user);
		this.setToken(token);
		this.events.emit('login', {
			user,
			token
		});
	}

	public setUser(user: U) {
		this._user = user;
		this.events.emit('user-set', user);
	}

	public updateUser(user: U) {
		const updatedUser = {...this.user, ...user};
		this.setUser(updatedUser);
		this.events.emit('user-update', updatedUser);
	}

	public async logout() {
		const user = this.user;
		this.setUser({} as U);
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
	public static setLogin = this.instance.setLogin;
	public static addListener = this.instance.addListener;
	public static setInitData = this.instance.setInitData;
	public static setCSRFToken = this.instance.setCSRFToken;
	public static getCSRFToken = this.instance.getCSRFToken;
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
	EventListener,
	TResponseData
};
export default API;