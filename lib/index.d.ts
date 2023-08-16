import Core from "./Core";
import { TParams } from "./types";
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
    get(params: TParams): {
        clearCache: () => void;
    } | undefined;
    post(params: TParams): {
        clearCache: () => void;
    } | undefined;
    private init;
    setToken(token: string): void;
    getToken(): string;
    get uid(): number;
    get user(): TUser;
    setUser(user: TUser): void;
    updateUser(user: TUser): void;
    logout(): void;
    static get: (params: TParams) => {
        clearCache: () => void;
    } | undefined;
    static post: (params: TParams) => {
        clearCache: () => void;
    } | undefined;
    static setHost: (host: string) => void;
    static setUser: (user: TUser) => void;
    static updateUser: (user: TUser) => void;
    static logout: () => void;
    static setToken: (token: string) => void;
    static addListener: (event: import("./types").TListenerEvents, callback: (data: any) => void) => import("easy-event-emitter").Event;
    static setInitData: (data: import("./types").TGroupsData) => void;
}
export default API;
