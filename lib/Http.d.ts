import Core from "./Core";
import { TMethod, TParams, TData } from "./types";
declare class Http extends Core {
    private cacheIndex;
    method: TMethod;
    params: TParams;
    constructor(method: TMethod, params: TParams, context?: Core);
    private success;
    private fail;
    private error;
    private complete;
    private encodeUrlParams;
    private cuteUndifinedParams;
    request(): this;
    updateCache(fieldKey: string, data: TData): void;
    clearCache(): void;
}
export default Http;
