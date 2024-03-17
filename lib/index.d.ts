import Core from "./Core";
import type { TConfig, TMethod, TParams, TResolveData, TListenerEvents } from "./types";
import type { Event } from "easy-event-emitter";
import Http from "./Http";
type TUser = {
    id: number;
    [index: string]: any;
};
/** Laravel API Client */
declare class API<DATA extends TResolveData = TResolveData, USER extends TUser = TUser> extends Core {
    private static instance;
    private _user;
    token?: string;
    constructor(config: TConfig);
    http(method: TMethod, params: TParams<DATA>): Http<DATA>;
    get(params: TParams<DATA>): Http<DATA>;
    head(params: TParams<DATA>): Http<DATA>;
    post(params: TParams<DATA>): Http<DATA>;
    put(params: TParams<DATA>): Http<DATA>;
    patch(params: TParams<DATA>): Http<DATA>;
    delete(params: TParams<DATA>): Http<DATA>;
    options(params: TParams<DATA>): Http<DATA>;
    connect(params: TParams<DATA>): Http<DATA>;
    trace(params: TParams<DATA>): Http<DATA>;
    addListener(event: TListenerEvents, callback: (data: any) => void): Event;
    setToken(token: string): Promise<void>;
    getToken(): string | undefined;
    getUid(): number;
    getUser(): USER;
    get uid(): number;
    get user(): USER;
    setUser(user: USER): Promise<void>;
    updateUser(user: USER): void;
    logout(): Promise<void>;
    static http: (method: TMethod, params: TParams<TResolveData>) => Http<TResolveData>;
    static get: (params: TParams<TResolveData>) => Http<TResolveData>;
    static head: (params: TParams<TResolveData>) => Http<TResolveData>;
    static post: (params: TParams<TResolveData>) => Http<TResolveData>;
    static put: (params: TParams<TResolveData>) => Http<TResolveData>;
    static patch: (params: TParams<TResolveData>) => Http<TResolveData>;
    static delete: (params: TParams<TResolveData>) => Http<TResolveData>;
    static options: (params: TParams<TResolveData>) => Http<TResolveData>;
    static connect: (params: TParams<TResolveData>) => Http<TResolveData>;
    static trace: (params: TParams<TResolveData>) => Http<TResolveData>;
    static setConfig: (config: TConfig) => void;
    static setHost: (host: string) => void;
    static setUser: (user: TUser) => Promise<void>;
    static updateUser: (user: TUser) => void;
    static logout: () => Promise<void>;
    static setToken: (token: string) => Promise<void>;
    static addListener: (event: TListenerEvents, callback: (data: any) => void) => Event;
    static setInitData: (data: import("./types").TGroupsData) => void;
    static triggerByCacheGroup: (groups: string | string[]) => void;
    static clearCacheGroup: (groups: string | string[], data?: import("./types").TData | undefined, fieldKey?: string | null) => void;
    static updateCacheGroup: (groups: string | string[], data: import("./types").TData, fieldKey?: string | null) => void;
    static getToken: () => string | undefined;
    static getUid: () => number;
    static getUser: () => TUser;
    static user: TUser;
    static uid: number;
    /**
     * @deprecated The method should not be used
     */
    static deleteCacheGroup: (groups: string | string[], data?: import("./types").TData | undefined, fieldKey?: string | null) => void;
}
export type { 
/**
 * @deprecated The type should not be used
 */
Event, Event as EventListener };
export default API;
