import Core from "./Core";
import { TMethod, TParams } from "./types";
import Http from "./Http";
type TUser = {
    [index: string]: any;
};
type TConfig = {
    host: string;
};
declare class API extends Core {
    private static instance;
    private _user;
    constructor(config: TConfig);
    http(method: TMethod, params: TParams): Http;
    get(params: TParams): Http;
    post(params: TParams): Http;
    private init;
    setToken(token: string): void;
    getToken(): string;
    getUid(): number;
    getUser(): TUser;
    get uid(): number;
    get user(): TUser;
    setUser(user: TUser): void;
    updateUser(user: TUser): void;
    logout(): void;
    static http: (method: TMethod, params: TParams) => Http;
    static get: (params: TParams) => Http;
    static post: (params: TParams) => Http;
    static setHost: (host: string) => void;
    static setUser: (user: TUser) => void;
    static updateUser: (user: TUser) => void;
    static logout: () => void;
    static setToken: (token: string) => void;
    static addListener: (event: import("./types").TListenerEvents, callback: (data: any) => void) => import("easy-event-emitter").Event;
    static setInitData: (data: import("./types").TGroupsData) => void;
    static deleteCacheGroup: (group: string) => void;
    static getToken: () => string;
    static getUid: () => number;
    static getUser: () => TUser;
    static user: TUser;
    static uid: number;
}
export default API;
