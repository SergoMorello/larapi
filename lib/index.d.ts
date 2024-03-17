import Core from "./Core";
import type { TUser, TConfig, TMethod, TParams, TResponseData, TListenerEvents } from "./types";
import type { Event } from "easy-event-emitter";
import Http from "./Http";
/** Laravel API Client */
declare class API<D extends TResponseData = TResponseData, U extends TUser = TUser> extends Core {
    private static instance;
    private _user;
    token?: string;
    constructor(config: TConfig);
    http(method: TMethod, params: TParams<D>): Http<D>;
    get(params: TParams<D>): Http<D>;
    head(params: TParams<D>): Http<D>;
    post(params: TParams<D>): Http<D>;
    put(params: TParams<D>): Http<D>;
    patch(params: TParams<D>): Http<D>;
    delete(params: TParams<D>): Http<D>;
    options(params: TParams<D>): Http<D>;
    connect(params: TParams<D>): Http<D>;
    trace(params: TParams<D>): Http<D>;
    addListener(event: TListenerEvents, callback: (data: any) => void): Event;
    setToken(token: string): Promise<void>;
    getToken(): string | undefined;
    getUid(): number;
    getUser(): U;
    get uid(): number;
    get user(): U;
    setUser(user: U): Promise<void>;
    updateUser(user: U): void;
    logout(): Promise<void>;
    static http: (method: TMethod, params: TParams<TResponseData>) => Http<TResponseData>;
    static get: (params: TParams<TResponseData>) => Http<TResponseData>;
    static head: (params: TParams<TResponseData>) => Http<TResponseData>;
    static post: (params: TParams<TResponseData>) => Http<TResponseData>;
    static put: (params: TParams<TResponseData>) => Http<TResponseData>;
    static patch: (params: TParams<TResponseData>) => Http<TResponseData>;
    static delete: (params: TParams<TResponseData>) => Http<TResponseData>;
    static options: (params: TParams<TResponseData>) => Http<TResponseData>;
    static connect: (params: TParams<TResponseData>) => Http<TResponseData>;
    static trace: (params: TParams<TResponseData>) => Http<TResponseData>;
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
Event, Event as EventListener, TResponseData };
export default API;
