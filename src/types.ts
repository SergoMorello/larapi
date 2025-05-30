export type TCacheBody = {
	data: any;
	group?: string;
	time: number;
};

export type TUser = {
	id: number;
	[index: string]: any;
};

export type TCache = {
	[index: string]: TCacheBody;
};

export type TError = {
	message?: string;
};

export type TData = {
	[index: string]: any | ((...args: any) => any);
};

export type TGroupsData = {
	[index: string]: TData;
};

export type TRequestHeaders = Record<string, string>;

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

export type TCoreRviverObject = {
	and?: {
		[index: string]: string[];
	};
	or?: {
		[index: string]: string[];
	}
};

export type TConfigDataReviver = {
	[index: string]: (value: any) => any;
};

export type TConfig = {
	host: string;
	reviver?: (this: any, key: string, value: any) => any;
	dataReviver?: TConfigDataReviver;
	headers?: TRequestHeaders;
};

export type TResponseData = {
	success: TData;
	error?: TError;
	fail?: TError;
};

export type TParams<P = string | keyof TResponseData['success'], D extends ((...args: any) => any) = TResponseData['success']['?'] | ((...args: any) => any),  M extends TMethod = TMethod, E extends TError = TError, F extends TError = TError> = {
	path: P;
	data?: Parameters<D>[0];
	file?: ArrayBuffer;
	fileSizeChunk?: number;
	stream?: boolean;
	body?: XMLHttpRequestBodyInit;
	cache?: string | boolean;
	cacheUpdate?: TCacheControll | TCacheControll[];
	cacheClear?: TCacheControll | TCacheControll[];
	clearUndifinedData?: boolean;
	forceRequest?: boolean;
	globalName?: string;
	queueThrottling?: boolean;
	headers?: TRequestHeaders;
	success?: (data: ReturnType<D>, xhr: XMLHttpRequest) => void;
	error?: (error: E) => void;
	fail?: (fail: F) => void;
	complete?: (complete: any) => void;
	progress?: (progress: TRequestProgress) => void;
	abort?: (error: E) => void;
};

export type TRequestParams = {
	method: TMethod;
	headers?: TRequestHeaders;
	body?: XMLHttpRequestBodyInit;
	withoutResponse?: boolean;
};

export type TListenerEvents = {
	'api-request-success': any;
	'api-request-abort': any;
	'api-request-fail': any;
	'api-request-error': any;
	'api-request-complete': any;
	'api-request-progress': any;
	'login': {
		user: any;
		token: string;
	};
	'logout': any;
	'user-set': any;
	'user-update': any;
	'token-update': string;
	'csrf-token-update': string;
};

// export type TListenerEvents = 'api-request-success' |
// 	'api-request-fail' |
// 	'api-request-error' |
// 	'api-request-complete' |
// 	'api-request-progress' |
// 	'login' |
// 	'logout' |
// 	'user-set' |
// 	'user-update' |
// 	'token-update' |
// 	'csrf-token-update';