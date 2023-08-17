"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-ignore
const md5_1 = __importDefault(require("md5"));
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
        this.deleteCacheGroup = this.deleteCacheGroup.bind(this);
        Object.assign(this, context);
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
