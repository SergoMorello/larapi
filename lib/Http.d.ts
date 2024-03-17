import Core from "./Core";
import Queue from './Queue';
import { Event, Events } from "easy-event-emitter";
import type { TMethod, TParams, TData, TRequestParams, TListenerEvents, TRequestProgress, TResponseData } from "./types";
declare class Http<D extends TResponseData = TResponseData> extends Core {
    private cacheIndex;
    currentCache?: TData;
    currentEvents: Events;
    requestParams: TRequestParams;
    method: TMethod;
    params: TParams<D>;
    path: string;
    queue: Queue<D>;
    queueName: string;
    constructor(method: TMethod, params: TParams<D>, context?: Core);
    private initRequest;
    private initCache;
    private initQueue;
    private setEmit;
    success(data: any): void;
    fail(data: any): void;
    error(data: any): void;
    complete(data: any): void;
    progress(progress: TRequestProgress): void;
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
