import Http from "./Http";
import type { TResolveData } from "./types";
declare class Queue<DATA extends TResolveData = TResolveData> {
    private static _Queue;
    private queue;
    http: Http<DATA>;
    constructor(http: Http<DATA>);
    has(request: string): boolean;
    get(request: string): Http<TResolveData> | undefined;
    clear(request: string): void;
    push(request: string): boolean;
}
export default Queue;
