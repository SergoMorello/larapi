"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-ignore
const md5_1 = __importDefault(require("md5"));
const Core_1 = __importDefault(require("./Core"));
class Http extends Core_1.default {
    constructor(method, params, context) {
        super(context);
        Object.defineProperty(this, "cacheIndex", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "currentCache", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "requestParams", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "method", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "params", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "path", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.cacheIndex = '';
        this.method = method;
        this.params = params;
        this.path = this.params.path;
        this.requestParams = {
            method: this.method
        };
        this.success = this.success.bind(this);
        this.fail = this.fail.bind(this);
        this.error = this.error.bind(this);
        this.complete = this.complete.bind(this);
        this.request = this.request.bind(this);
        this.addListener = this.addListener.bind(this);
        this.addHeader = this.addHeader.bind(this);
        this.deleteHeader = this.deleteHeader.bind(this);
        this.initRequest();
        this.initCache();
    }
    initRequest() {
        this.requestParams.headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        this.params.data = this.params.data ? this.cuteUndifinedParams(this.params.data) : this.params.data;
        if (this.method === 'GET') {
            if (this.params.data)
                this.path = this.params.path + '?' + this.encodeUrlParams(this.params.data);
        }
        if (this.method === 'POST') {
            this.requestParams.body = JSON.stringify(this.params.data);
        }
    }
    initCache() {
        var _a;
        this.cacheIndex = (0, md5_1.default)(this.path + JSON.stringify(this.params.data));
        if (this.params.globalName) {
            if (this.initData[this.params.globalName]) {
                this.setCache(this.cacheIndex, this.initData[this.params.globalName], (typeof this.params.cache === 'boolean' ? undefined : this.params.cache));
                this.params.cache = (_a = this.params.cache) !== null && _a !== void 0 ? _a : true;
                delete this.initData[this.params.globalName];
            }
        }
        if (this.params.cache) {
            if (this.currentCache = this.getCache(this.cacheIndex)) {
                this.success(this.currentCache);
                this.complete(this.currentCache);
            }
        }
        else {
            this.deleteCache(this.cacheIndex);
        }
    }
    //Заголовки от 200 до 299
    success(...args) {
        if (typeof this.params.success === 'function')
            this.params.success(...args);
        if (this.params.cacheUpdate && this.params.data) {
            this.updateCacheGroup(typeof this.params.cacheUpdate === 'string' ? this.params.cacheUpdate : this.params.cacheUpdate.group, this.params.data, typeof this.params.cacheUpdate === 'string' ? undefined : this.params.cacheUpdate.fieldKey);
        }
        if (this.params.cacheClear && this.params.data) {
            this.clearCacheGroup(typeof this.params.cacheClear === 'string' ? this.params.cacheClear : this.params.cacheClear.group, this.params.data, typeof this.params.cacheClear === 'string' ? undefined : this.params.cacheClear.fieldKey);
        }
    }
    //Заголовки от 400 до 499
    fail(...args) {
        if (typeof this.params.fail === 'function') {
            this.params.fail(...args);
        }
        this.events.emit('api-request-fail', args);
    }
    //Все остальные
    error(...args) {
        if (typeof this.params.error === 'function') {
            this.params.error(...args);
        }
        this.events.emit('api-request-error', args);
    }
    complete(...args) {
        if (typeof this.params.complete === 'function') {
            this.params.complete(...args);
        }
        this.events.emit('api-request-complete', args);
    }
    encodeUrlParams(data) {
        return Object.keys(data).map(function (k) {
            return encodeURIComponent(k) + "=" + encodeURIComponent(data[k]);
        }).join('&');
    }
    cuteUndifinedParams(data) {
        if (typeof data !== 'object') {
            return;
        }
        for (const key in data) {
            if (!data[key]) {
                delete data[key];
            }
        }
        return data;
    }
    request() {
        if (typeof XMLHttpRequest === 'undefined' || this.currentCache)
            return this;
        try {
            const xhr = new XMLHttpRequest();
            xhr.open(this.method, this.host + this.path, true);
            for (const header in this.requestParams.headers) {
                xhr.setRequestHeader(header, this.requestParams.headers[header]);
            }
            xhr.onreadystatechange = () => {
                if (xhr.readyState !== 4) {
                    return;
                }
                const result = this.isJsonString(xhr.responseText) ? JSON.parse(xhr.responseText) : {};
                if (xhr.status >= 200 && xhr.status <= 299) {
                    if (this.params.cache) {
                        this.setCache(this.cacheIndex, result, (typeof this.params.cache === 'boolean' ? undefined : this.params.cache));
                    }
                    this.success(result);
                }
                else {
                    if (xhr.status >= 400 && xhr.status <= 499) {
                        fail(result);
                    }
                    this.error(result);
                    console.warn(result);
                }
                this.complete(result);
            };
            xhr.send(this.requestParams.body);
        }
        catch (e) {
            console.warn(e);
        }
        return this;
    }
    addHeader(key, value) {
        this.requestParams.headers = Object.assign(Object.assign({}, this.requestParams.headers), { [key]: value });
        return this;
    }
    deleteHeader(key) {
        if (this.requestParams.headers && (key in this.requestParams.headers)) {
            delete this.requestParams.headers[key];
        }
        return this;
    }
    updateCache(data, fieldKey = 'id') {
        const cache = this.getCacheByIndex(this.cacheIndex);
        if (cache && cache.group) {
            this.updateCacheGroup(cache.group, data, fieldKey);
        }
    }
    clearCache(data, fieldKey = 'id') {
        if (data) {
            const cache = this.getCacheByIndex(this.cacheIndex);
            if (cache && cache.group) {
                this.clearCacheGroup(cache.group, data, fieldKey);
            }
        }
        else {
            this.deleteCache(this.cacheIndex);
        }
    }
}
exports.default = Http;
