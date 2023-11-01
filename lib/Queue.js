"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Queue {
    constructor() {
        Object.defineProperty(this, "queue", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
    }
    has(request) {
        return request in this.queue;
    }
    push(request, instance) {
        const hasExist = this.has(request);
        this.queue[request].push(instance);
        return hasExist;
    }
}
exports.default = Queue;
