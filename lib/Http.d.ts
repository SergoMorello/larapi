import Core from "./Core";
import { TMethod, TParams, TData, TRequestParams } from "./types";
declare class Http extends Core {
    private cacheIndex;
    currentCache?: TData;
    requestParams: TRequestParams;
    method: TMethod;
    params: TParams;
    path: string;
    constructor(method: TMethod, params: TParams, context?: Core);
    private initRequest;
    private initCache;
    private success;
    private fail;
    private error;
    private complete;
    private encodeUrlParams;
    private cuteUndifinedParams;
    request(): this;
    addHeader(key: string, value: string): this;
    deleteHeader(key: string): this;
    updateCache(data: TData, fieldKey?: string | null): void;
    clearCache(data?: TData, fieldKey?: string | null): void;
}
export default Http;
