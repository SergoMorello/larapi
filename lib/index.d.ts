import Core from "./Core";
import type { TMethod, TParams, TListenerEvents } from "./types";
import type { Event } from "easy-event-emitter";
import Http from "./Http";
type TUser = {
    id: number;
    [index: string]: any;
};
type TConfig = {
    host: string;
};
/** Laravel API Client */
declare class API<USER extends TUser = TUser> extends Core {
    private static instance;
    private _user;
    token?: string;
    constructor(config: TConfig);
    http(method: TMethod, params: TParams): Http;
    get(params: TParams): Http;
    head(params: TParams): Http;
    post(params: TParams): Http;
    put(params: TParams): Http;
    patch(params: TParams): Http;
    delete(params: TParams): Http;
    options(params: TParams): Http;
    connect(params: TParams): Http;
    trace(params: TParams): Http;
    private init;
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
    static http: (method: TMethod, params: TParams) => Http;
    static get: (params: TParams) => Http;
    static head: (params: TParams) => Http;
    static post: (params: TParams) => Http;
    static put: (params: TParams) => Http;
    static patch: (params: TParams) => Http;
    static delete: (params: TParams) => Http;
    static options: (params: TParams) => Http;
    static connect: (params: TParams) => Http;
    static trace: (params: TParams) => Http;
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
export type { Event };
export default API;
