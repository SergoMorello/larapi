import Core from "./Core";
import { TParams } from "./types";

type TUser = {
	[index: string]: any;
}

type TConfig = {
	host: string;
}

class API extends Core {
	private static instance = new API({
		host: ''
	});
	private _user: TUser;

	constructor(config: TConfig) {
		super();
		this.setHost(config.host);
		this._user = {};
		this.init();

		this.setToken = this.setToken.bind(this);
		this.setUser = this.setUser.bind(this);
		this.updateUser = this.updateUser.bind(this);
		this.logout = this.logout.bind(this);
		this.getToken = this.getToken.bind(this);
		this.get = this.get.bind(this);
		this.post = this.post.bind(this);
	}

	public get(params: TParams) {
		return this.request('GET', params);
	}

	public post(params: TParams) {
		return this.request('POST', params);
	}

	private init(): void {
		if (typeof window === 'undefined') return;
		const token = localStorage.getItem('token');
		const strUser = localStorage.getItem('user');
		if (strUser) {
			const user: TUser = JSON.parse(strUser);
			this.setUser(user);
		}
		if (token) {
			this.setToken(token);
		}
	}

	public setToken(token: string) {
		if (typeof window === 'undefined') return;
		localStorage.setItem('token', token);
		this.token = token;
	}

	public getToken() {
		return this.token;
	}

	public get uid(): number {
			return 'id' in this._user ? Number(this._user.id) : 0;
	}

	public get user(): TUser {
		return this._user;
	}

	public setUser(user: TUser) {
		if (typeof window === 'undefined') return;
		localStorage.setItem('user', JSON.stringify(user));
		this._user = user;
		this.events.emit('login', user);
	}

	public updateUser(user: TUser) {
		this.events.emit('update', this.user);
		this.setUser({...this.user, ...user});
	}

	public logout() {
		if (typeof window === 'undefined') return;
		localStorage.removeItem('user');
		localStorage.removeItem('token');
		this.events.emit('logout', this.user);
		this.setUser({});
		this.setToken('');
	}

	public static get = this.instance.get;
	public static post = this.instance.post;
	public static setHost = this.instance.setHost;
	public static setUser = this.instance.setUser;
	public static updateUser = this.instance.updateUser;
	public static logout = this.instance.logout;
	public static setToken = this.instance.setToken;
	public static addListener = this.instance.addListener;
	public static setInitData = this.instance.setInitData;
	public static deleteCacheGroup = this.instance.deleteCacheGroup;
	public static getToken = this.instance.getToken;
	public static user = this.instance.user;
	public static uid = this.instance.uid;
}

(globalThis as any).apiSetInitData = API.setInitData;

export default API;