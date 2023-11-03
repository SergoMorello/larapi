import Http from "./Http";
declare class Queue {
    private static instance;
    private queue;
    constructor();
    has(request: string): boolean;
    get(request: string): Http | undefined;
    clear(request: string): void;
    push(request: string, instance: Http): boolean;
    static has: (request: string) => boolean;
    static get: (request: string) => Http | undefined;
    static clear: (request: string) => void;
    static push: (request: string, instance: Http) => boolean;
}
export default Queue;
