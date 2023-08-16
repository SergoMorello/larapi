"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-ignore
const md5_1 = __importDefault(require("md5"));
const easy_event_emitter_1 = __importDefault(require("easy-event-emitter"));
class Core {
    constructor() {
        Object.defineProperty(this, "host", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "token", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "cache", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "initData", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "events", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.events = new easy_event_emitter_1.default();
        this.host = 'http://127.0.0.1/';
        this.token = '';
        this.cache = {};
        this.initData = {};
        this.request = this.request.bind(this);
        this.setHost = this.setHost.bind(this);
        this.addListener = this.addListener.bind(this);
        this.setInitData = this.setInitData.bind(this);
    }
    request(method, params) {
        var _a;
        if (typeof XMLHttpRequest === 'undefined')
            return;
        //Заголовки от 200 до 299
        const success = (...args) => {
            if (typeof params.success === 'function')
                params.success(...args);
        };
        //Заголовки от 400 до 499
        const fail = (...args) => {
            if (typeof params.fail === 'function') {
                params.fail(...args);
            }
            this.events.emit('api-request-fail', args);
        };
        //Все остальные
        const error = (...args) => {
            if (typeof params.error === 'function') {
                params.error(...args);
            }
            this.events.emit('api-request-error', args);
        };
        const complete = (...args) => {
            if (typeof params.complete === 'function') {
                params.complete(...args);
            }
            this.events.emit('api-request-complete', args);
        };
        const encodeUrlParams = (data) => {
            return Object.keys(data).map(function (k) {
                return encodeURIComponent(k) + "=" + encodeURIComponent(data[k]);
            }).join('&');
        };
        const cuteUndifinedParams = (data) => {
            if (typeof data !== 'object') {
                return;
            }
            for (const key in data) {
                if (!data[key]) {
                    delete data[key];
                }
            }
            return data;
        };
        var path = params.path;
        const fetchParams = {
            method: method
        };
        fetchParams.headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.token
        };
        params.data = params.data ? cuteUndifinedParams(params.data) : params.data;
        if (method === 'POST') {
            fetchParams.body = JSON.stringify(params.data);
        }
        if (method === 'GET') {
            if (params.data)
                path = params.path + '?' + encodeUrlParams(params.data);
        }
        const pathCache = (0, md5_1.default)(path + JSON.stringify(params.data));
        var dataCache;
        if (params.globalName) {
            if (this.initData[params.globalName]) {
                this.setCache(pathCache, this.initData[params.globalName], (typeof params.cache === 'boolean' ? undefined : params.cache));
                params.cache = (_a = params.cache) !== null && _a !== void 0 ? _a : true;
                delete this.initData[params.globalName];
            }
        }
        if (params.cache) {
            if (dataCache = this.getCache(pathCache)) {
                success(dataCache);
                complete(dataCache);
            }
        }
        else {
            this.deleteCache(pathCache);
        }
        if (!dataCache) {
            try {
                const xhr = new XMLHttpRequest();
                xhr.open(method, this.host + path, true);
                for (const header in fetchParams.headers) {
                    xhr.setRequestHeader(header, fetchParams.headers[header]);
                }
                xhr.onreadystatechange = () => {
                    if (xhr.readyState !== 4) {
                        return;
                    }
                    const result = xhr.responseText ? JSON.parse(xhr.responseText) : {};
                    if (xhr.status >= 200 && xhr.status <= 299) {
                        if (params.cache) {
                            this.setCache(pathCache, result, (typeof params.cache === 'boolean' ? undefined : params.cache));
                        }
                        success(result);
                    }
                    else {
                        if (xhr.status >= 400 && xhr.status <= 499) {
                            fail(result);
                        }
                        error(result);
                        console.warn(result);
                    }
                    complete(result);
                };
                xhr.send(fetchParams.body);
            }
            catch (e) {
                console.warn(e);
            }
        }
        return {
            clearCache: () => {
                this.deleteCache(pathCache);
            }
        };
    }
    addListener(event, callback) {
        return this.events.addListener(event, callback);
    }
    getCache(request) {
        const key = (0, md5_1.default)(request);
        if (this.cache[key]) {
            if ((new Date()).getTime() <= (this.cache[key].time + 3600000000)) {
                return this.cache[key].data;
            }
            else {
                delete this.cache[key];
            }
        }
    }
    setHost(host) {
        this.host = host;
    }
    setCache(request, data, group) {
        this.cache[(0, md5_1.default)(request)] = {
            time: (new Date()).getTime(),
            data: data,
            group: group
        };
    }
    deleteCacheGroup(group) {
        for (const key in this.cache) {
            if (this.cache[key].group === group) {
                delete this.cache[key];
            }
        }
    }
    deleteCache(request) {
        const keyCache = (0, md5_1.default)(request);
        if (!this.cache[keyCache])
            return;
        const group = this.cache[keyCache].group;
        if (group) {
            this.deleteCacheGroup(group);
        }
        delete this.cache[keyCache];
    }
    setInitData(data) {
        this.initData = data;
    }
}
exports.default = Core;
