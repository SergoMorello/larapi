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

		this.setUser = this.setUser.bind(this);
		this.updateUser = this.updateUser.bind(this);
		this.logout = this.logout.bind(this);
	}

	public get(params: TParams) {
		return this.request('GET', params);
	}

	public post(params: TParams) {
		return this.request('POST', params);
	}

	private init(): void {
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

	public get uid(): number {
			return 'id' in this._user ? Number(this._user.id) : 0;
	}

	public get user(): TUser {
		return this._user;
	}

	public setUser(user: TUser) {
		localStorage.setItem('user', JSON.stringify(user));
		this._user = user;
		this.events.emit('login', user);
	}

	public updateUser(user: TUser) {
		this.events.emit('update', this.user);
		this.setUser({...this.user, ...user});
	}

	public logout() {
		this.events.emit('logout', this.user);
		localStorage.removeItem('user');
		localStorage.removeItem('token');
		this.setUser({});
		this.setToken('');
	}

	public static setHost = this.instance.setHost;
	public static setUser = this.instance.setUser;
	public static updateUser = this.instance.updateUser;
	public static logout = this.instance.logout;
	public static setToken = this.instance.setToken;
	public static addListener = this.instance.addListener;
}

export default API;