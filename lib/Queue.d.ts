import Http from "./Http";
import type { TResponseData } from "./types";
declare class Queue<D extends TResponseData = TResponseData> {
    private static _Queue;
    private queue;
    http: Http<D>;
    constructor(http: Http<D>);
    has(request: string): boolean;
    get(request: string): Http<TResponseData, any, any> | undefined;
    clear(request: string): void;
    push(request: string): boolean;
}
export default Queue;
