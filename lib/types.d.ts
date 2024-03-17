export type TCacheBody = {
    data: any;
    group?: string;
    time: number;
};
export type TCache = {
    [index: string]: TCacheBody;
};
export type TData = {
    [index: string]: any;
};
export type TGroupsData = {
    [index: string]: TData;
};
export type TMethod = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'CONNECT' | 'TRACE';
export type TCacheControll = string | {
    group: string;
    fieldKey: string;
};
export type TRequestProgress = {
    percent: number;
    total: number;
    loaded: number;
};
export type TConfigDataReplace = {
    [index: string]: (value: any) => any;
};
export type TConfig = {
    host: string;
    dataReplaceCallback?: (this: any, key: string, value: any) => any;
    dataReplace?: TConfigDataReplace;
};
export type TResolveData = {
    success: TData;
    error?: TData;
    fail?: TData;
};
export type TParams<T extends TResolveData = TResolveData, PATH extends keyof T['success'] = keyof T['success'], DATA extends T['success'][PATH] = T['success'][PATH]> = {
    path: PATH;
    data?: TData;
    cache?: string | boolean;
    cacheUpdate?: TCacheControll | TCacheControll[];
    cacheClear?: TCacheControll | TCacheControll[];
    globalName?: string;
    queueThrottling?: boolean;
    success?: (data: DATA) => void;
    error?: (data: T['error']) => void;
    fail?: (data: T['fail']) => void;
    complete?: (data: any) => void;
    progress?: (progress: TRequestProgress) => void;
};
export type TRequestParams = {
    method: TMethod;
    headers?: {
        [index: string]: string;
    };
    body?: string;
    withoutResponse?: boolean;
};
export type TListenerEvents = 'api-request-success' | 'api-request-fail' | 'api-request-error' | 'api-request-complete' | 'api-request-progress' | 'login' | 'logout' | 'user-update';
