import Core from "./Core";
import type { TUser, TConfig, TMethod, TParams, TResponseData, TListenerEvents } from "./types";
import type { Event } from "easy-event-emitter";
import Http from "./Http";
/** Laravel API Client */
declare class API<D extends TResponseData = TResponseData, U extends TUser = TUser, S extends D['success'] = D['success']> extends Core {
    private static instance;
    private _user;
    token?: string;
    constructor(config: TConfig);
    http<PATH extends keyof S, DATA extends S[PATH]>(method: TMethod, params: TParams<PATH, DATA>): Http<D, PATH, DATA>;
    get<PATH extends keyof S, DATA extends S[PATH]>(params: TParams<PATH, DATA, 'GET'>): Http<D, PATH, DATA>;
    head<PATH extends keyof S, DATA extends S[PATH]>(params: TParams<PATH, DATA>): Http<D, PATH, DATA>;
    post<PATH extends keyof S, DATA extends S[PATH]>(params: TParams<PATH, DATA>): Http<D, PATH, DATA>;
    put<PATH extends keyof S, DATA extends S[PATH]>(params: TParams<PATH, DATA>): Http<D, PATH, DATA>;
    patch<PATH extends keyof S, DATA extends S[PATH]>(params: TParams<PATH, DATA>): Http<D, PATH, DATA>;
    delete<PATH extends keyof S, DATA extends S[PATH]>(params: TParams<PATH, DATA>): Http<D, PATH, DATA>;
    options<PATH extends keyof S, DATA extends S[PATH]>(params: TParams<PATH, DATA>): Http<D, PATH, DATA>;
    connect<PATH extends keyof S, DATA extends S[PATH]>(params: TParams<PATH, DATA>): Http<D, PATH, DATA>;
    trace<PATH extends keyof S, DATA extends S[PATH]>(params: TParams<PATH, DATA>): Http<D, PATH, DATA>;
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
    static http: <PATH extends string | number, DATA extends import("./types").TData[PATH]>(method: TMethod, params: TParams<PATH, DATA>) => Http<TResponseData, PATH, DATA>;
    static get: <PATH extends string | number, DATA extends import("./types").TData[PATH]>(params: TParams<PATH, DATA, "GET">) => Http<TResponseData, PATH, DATA>;
    static head: <PATH extends string | number, DATA extends import("./types").TData[PATH]>(params: TParams<PATH, DATA>) => Http<TResponseData, PATH, DATA>;
    static post: <PATH extends string | number, DATA extends import("./types").TData[PATH]>(params: TParams<PATH, DATA>) => Http<TResponseData, PATH, DATA>;
    static put: <PATH extends string | number, DATA extends import("./types").TData[PATH]>(params: TParams<PATH, DATA>) => Http<TResponseData, PATH, DATA>;
    static patch: <PATH extends string | number, DATA extends import("./types").TData[PATH]>(params: TParams<PATH, DATA>) => Http<TResponseData, PATH, DATA>;
    static delete: <PATH extends string | number, DATA extends import("./types").TData[PATH]>(params: TParams<PATH, DATA>) => Http<TResponseData, PATH, DATA>;
    static options: <PATH extends string | number, DATA extends import("./types").TData[PATH]>(params: TParams<PATH, DATA>) => Http<TResponseData, PATH, DATA>;
    static connect: <PATH extends string | number, DATA extends import("./types").TData[PATH]>(params: TParams<PATH, DATA>) => Http<TResponseData, PATH, DATA>;
    static trace: <PATH extends string | number, DATA extends import("./types").TData[PATH]>(params: TParams<PATH, DATA>) => Http<TResponseData, PATH, DATA>;
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
