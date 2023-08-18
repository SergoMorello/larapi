"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const easy_event_emitter_1 = __importDefault(require("easy-event-emitter"));
class Core {
    constructor(context) {
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
        this.events = new easy_event_emitter_1.default();
        this.host = 'http://127.0.0.1/';
        this.token = '';
        this.cache = {};
        this.initData = {};
        this.setHost = this.setHost.bind(this);
        this.addListener = this.addListener.bind(this);
        this.setInitData = this.setInitData.bind(this);
        this.clearCacheGroup = this.clearCacheGroup.bind(this);
        Object.assign(this, context);
    }
    addListener(event, callback) {
        return this.events.addListener(event, callback);
    }
    getCache(key) {
        if (this.cache[key]) {
            if ((new Date()).getTime() <= (this.cache[key].time + 3600000000)) {
                return this.cache[key].data;
            }
            else {
                delete this.cache[key];
            }
        }
    }
    isJsonString(str) {
        try {
            JSON.parse(str);
        }
        catch (e) {
            return false;
        }
        return true;
    }
    setHost(host) {
        this.host = host;
    }
    setCache(key, data, group) {
        this.cache[key] = {
            time: (new Date()).getTime(),
            data: data,
            group: group
        };
    }
    clearCacheGroup(group, data, fieldKey = 'id') {
        if (data) {
            const clear = (cacheData) => {
                if ((fieldKey && (cacheData === null || cacheData === void 0 ? void 0 : cacheData[fieldKey]) === (data === null || data === void 0 ? void 0 : data[fieldKey])) || fieldKey === null) {
                    for (const key in cacheData) {
                        if (key in data) {
                            return false;
                        }
                    }
                }
                return true;
            };
            for (const key in this.cache) {
                if (this.cache[key].group === group) {
                    if (Array.isArray(this.cache[key].data)) {
                        this.cache[key].data = Object.values(this.cache[key].data).filter(clear);
                    }
                    else {
                        if (!clear(this.cache[key].data))
                            delete this.cache[key];
                    }
                }
            }
        }
        else {
            for (const key in this.cache) {
                if (this.cache[key].group === group) {
                    delete this.cache[key];
                }
            }
        }
    }
    updateCacheGroup(group, data, fieldKey = 'id') {
        const update = (cacheData) => {
            const retData = cacheData;
            for (const key of fieldKey.split('.')) {
                cacheData = cacheData[key];
            }
            if ((fieldKey && cacheData[fieldKey] === data[fieldKey]) || fieldKey === null) {
                for (const key in cacheData) {
                    if (key in data) {
                        cacheData[key] = data[key];
                    }
                }
            }
            return retData;
        };
        for (const key in this.cache) {
            if (this.cache[key].group === group) {
                if (Array.isArray(this.cache[key].data)) {
                    this.cache[key].data = Object.values(this.cache[key].data).map(update);
                }
                else {
                    this.cache[key].data = update(this.cache[key].data);
                }
            }
        }
    }
    getCacheByIndex(index) {
        return this.cache[index];
    }
    deleteCache(key) {
        if (!this.cache[key])
            return;
        const group = this.cache[key].group;
        if (group) {
            this.clearCacheGroup(group);
        }
        delete this.cache[key];
    }
    setInitData(data) {
        this.initData = data;
    }
}
exports.default = Core;
