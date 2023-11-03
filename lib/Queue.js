"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const Http_1 = __importDefault(require("./Http"));
class Queue {
    constructor() {
        Object.defineProperty(this, "queue", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        this.has = this.has.bind(this);
        this.get = this.get.bind(this);
        this.push = this.push.bind(this);
    }
    has(request) {
        return request in this.queue;
    }
    get(request) {
        return this.has(request) ? this.queue[request] : undefined;
    }
    push(request, instance) {
        const refInstance = this.get(request);
        if (!refInstance) {
            this.queue[request] = instance;
        }
        else {
            refInstance === null || refInstance === void 0 ? void 0 : refInstance.addListener('api-request-success', instance.success);
            refInstance === null || refInstance === void 0 ? void 0 : refInstance.addListener('api-request-error', instance.error);
            refInstance === null || refInstance === void 0 ? void 0 : refInstance.addListener('api-request-fail', instance.fail);
            refInstance === null || refInstance === void 0 ? void 0 : refInstance.addListener('api-request-complete', instance.complete);
        }
        return refInstance instanceof Http_1.default;
    }
}
_a = Queue;
Object.defineProperty(Queue, "instance", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: new Queue
});
Object.defineProperty(Queue, "has", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: _a.instance.has
});
Object.defineProperty(Queue, "get", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: _a.instance.get
});
Object.defineProperty(Queue, "push", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: _a.instance.push
});
exports.default = Queue;
