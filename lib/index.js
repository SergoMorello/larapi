"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const Core_1 = __importDefault(require("./Core"));
class API extends Core_1.default {
    constructor(config) {
        super();
        Object.defineProperty(this, "_user", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.setHost(config.host);
        this._user = {};
        this.init();
        this.setUser = this.setUser.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.logout = this.logout.bind(this);
    }
    get(params) {
        return this.request('GET', params);
    }
    post(params) {
        return this.request('POST', params);
    }
    init() {
        const token = localStorage.getItem('token');
        const strUser = localStorage.getItem('user');
        if (strUser) {
            const user = JSON.parse(strUser);
            this.setUser(user);
        }
        if (token) {
            this.setToken(token);
        }
    }
    get uid() {
        return 'id' in this._user ? Number(this._user.id) : 0;
    }
    get user() {
        return this._user;
    }
    setUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
        this._user = user;
        this.events.emit('login', user);
    }
    updateUser(user) {
        this.events.emit('update', this.user);
        this.setUser(Object.assign(Object.assign({}, this.user), user));
    }
    logout() {
        this.events.emit('logout', this.user);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        this.setUser({});
        this.setToken('');
    }
}
_a = API;
Object.defineProperty(API, "instance", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: new API({
        host: ''
    })
});
Object.defineProperty(API, "setHost", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: _a.instance.setHost
});
Object.defineProperty(API, "setUser", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: _a.instance.setUser
});
Object.defineProperty(API, "updateUser", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: _a.instance.updateUser
});
Object.defineProperty(API, "logout", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: _a.instance.logout
});
Object.defineProperty(API, "setToken", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: _a.instance.setToken
});
Object.defineProperty(API, "addListener", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: _a.instance.addListener
});
exports.default = API;
