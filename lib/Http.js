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
        this.cacheIndex = '';
        this.method = method;
        this.params = params;
        this.success = this.success.bind(this);
        this.fail = this.fail.bind(this);
        this.error = this.error.bind(this);
        this.complete = this.complete.bind(this);
        this.request = this.request.bind(this);
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
        var _a;
        if (typeof XMLHttpRequest === 'undefined')
            return this;
        var path = this.params.path;
        const fetchParams = {
            method: this.method
        };
        fetchParams.headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.token
        };
        this.params.data = this.params.data ? this.cuteUndifinedParams(this.params.data) : this.params.data;
        if (this.method === 'POST') {
            fetchParams.body = JSON.stringify(this.params.data);
        }
        if (this.method === 'GET') {
            if (this.params.data)
                path = this.params.path + '?' + this.encodeUrlParams(this.params.data);
        }
        this.cacheIndex = (0, md5_1.default)(path + JSON.stringify(this.params.data));
        var dataCache;
        if (this.params.globalName) {
            if (this.initData[this.params.globalName]) {
                this.setCache(this.cacheIndex, this.initData[this.params.globalName], (typeof this.params.cache === 'boolean' ? undefined : this.params.cache));
                this.params.cache = (_a = this.params.cache) !== null && _a !== void 0 ? _a : true;
                delete this.initData[this.params.globalName];
            }
        }
        if (this.params.cache) {
            if (dataCache = this.getCache(this.cacheIndex)) {
                this.success(dataCache);
                this.complete(dataCache);
            }
        }
        else {
            this.deleteCache(this.cacheIndex);
        }
        if (!dataCache) {
            try {
                const xhr = new XMLHttpRequest();
                xhr.open(this.method, this.host + path, true);
                for (const header in fetchParams.headers) {
                    xhr.setRequestHeader(header, fetchParams.headers[header]);
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
                xhr.send(fetchParams.body);
            }
            catch (e) {
                console.warn(e);
            }
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
