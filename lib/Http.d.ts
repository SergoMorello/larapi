import Core from "./Core";
import { Event, Events } from "easy-event-emitter";
import type { TMethod, TParams, TData, TRequestParams, TListenerEvents } from "./types";
declare class Http extends Core {
    private cacheIndex;
    currentCache?: TData;
    currentEvents: Events;
    requestParams: TRequestParams;
    method: TMethod;
    params: TParams;
    path: string;
    constructor(method: TMethod, params: TParams, context?: Core);
    private initRequest;
    private initCache;
    private setEmit;
    success(...args: any): void;
    fail(...args: any): void;
    error(...args: any): void;
    complete(...args: any): void;
    private encodeUrlParams;
    private cuteUndifinedParams;
    request(): this;
    addHeader(key: string, value: string): this;
    addListener(event: TListenerEvents, callback: (data: any) => void): Event;
    deleteHeader(key: string): this;
    updateCache(data: TData, fieldKey?: string | null): void;
    clearCache(data?: TData, fieldKey?: string | null): void;
}
export default Http;
