import Core from "./Core";
import type {
	TMethod,
	TParams,
	TListenerEvents
} from "./types";
import type {
	Event
} from "easy-event-emitter";
import Http from "./Http";

type TUser = {
	id: number;
	[index: string]: any;
}

type TConfig = {
	host: string;
}

/** Laravel API Client */
class API<USER extends TUser = TUser> extends Core {
	private static instance = new API({
		host: ''
	});
	private _user: USER;
		token?: string;

	constructor(config: TConfig) {
		super();
		this.setHost(config.host);
		this._user = {} as USER;
		this.init();

		this.setToken = this.setToken.bind(this);
		this.setUser = this.setUser.bind(this);
		this.updateUser = this.updateUser.bind(this);
		this.logout = this.logout.bind(this);
		this.getToken = this.getToken.bind(this);
		this.http = this.http.bind(this);
		this.get = this.get.bind(this);
		this.post = this.post.bind(this);
		this.put = this.put.bind(this);
		this.patch = this.patch.bind(this);
		this.delete = this.delete.bind(this);
		this.options = this.options.bind(this);
		this.getUid = this.getUid.bind(this);
		this.getUser = this.getUser.bind(this);
	}

	public http(method: TMethod, params: TParams): Http {
		const http = new Http(method, params, this);
		if (this.token) {
			http.addHeader('Authorization', 'Bearer ' + this.token);
		}
		return http;
	}

	public get(params: TParams): Http {
		return this.http('GET', params).request();
	}

	public post(params: TParams): Http {
		return this.http('POST', params).request();
	}

	public put(params: TParams): Http {
		return this.http('PUT', params).request();
	}

	public patch(params: TParams): Http {
		return this.http('PATCH', params).request();
	}

	public delete(params: TParams): Http {
		return this.http('DELETE', params).request();
	}

	public options(params: TParams): Http {
		return this.http('OPTIONS', params).request();
	}

	private init(): void {
		if (typeof window === 'undefined') return;
		const token = localStorage.getItem('token');
		const strUser = localStorage.getItem('user');
		if (strUser) {
			const user: USER = JSON.parse(strUser);
			this.setUser(user);
		}
		if (token) {
			this.setToken(token);
		}
	}

	public addListener(event: TListenerEvents, callback: (data: any) => void): Event {
		return this.events.addListener(event, callback);
	}

	public setToken(token: string) {
		if (typeof window === 'undefined') return;
		localStorage.setItem('token', token);
		this.token = token;
	}

	public getToken() {
		return this.token;
	}

	public getUid(): number {
		return ('id' in this._user) ? Number(this._user.id) : 0;
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

	public setUser(user: USER) {
		if (typeof window === 'undefined') return;
		localStorage.setItem('user', JSON.stringify(user));
		this._user = user;
		this.events.emit('login', user);
	}

	public updateUser(user: USER) {
		this.events.emit('update', this.user);
		this.setUser({...this.user, ...user});
	}

	public logout() {
		if (typeof window === 'undefined') return;
		localStorage.removeItem('user');
		localStorage.removeItem('token');
		this.events.emit('logout', this.user);
		this.setUser({} as USER);
		this.setToken('');
	}

	public static http = this.instance.http;
	public static get = this.instance.get;
	public static post = this.instance.post;
	public static setHost = this.instance.setHost;
	public static setUser = this.instance.setUser;
	public static updateUser = this.instance.updateUser;
	public static logout = this.instance.logout;
	public static setToken = this.instance.setToken;
	public static addListener = this.instance.addListener;
	public static setInitData = this.instance.setInitData;
	public static clearCacheGroup = this.instance.clearCacheGroup;
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

export default API;