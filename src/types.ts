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
	tryRequest?: number;
	tryRequestDelay?: number;
	dataReviver?: TConfigDataReviver;
	headers?: TRequestHeaders;
	clearUndifinedData?: boolean;
	timeout?: number;
};

export type TResponseData = {
	success: TData;
	error?: TError;
	fail?: TError;
};

export type TParams<
	P = string | keyof TResponseData['success'],
	D extends ((...args: any) => any) = TResponseData['success']['?'] | ((...args: any) => any),
	M extends TMethod = TMethod,
	E extends TError = TError,
	F extends TError = TError> = Partial<TConfig> &
{
	path: P;
	data?: Parameters<D>[0];
	/**
	 * FileReader file object.
	 * If present, the file will be sent in chunks.
	*/
	file?: ArrayBuffer;
	/**
	 * When uploading a file, get the ID from the server.
	 * You can pass `true` — then the variable will be named `file_id`,
	 * or pass a string like `id_file`, `filename`, etc.
	 */
	fileIdByServer?: boolean | string;
	fileSizeChunk?: number;
	/**
	 * Receive data as a stream.
	 * On success, the response will contain the object `body?.getReader()`.
	 */
	stream?: boolean;
	body?: XMLHttpRequestBodyInit;
	/**
	 * Enable data caching.
	 * You can pass `true`, or a string key to work with the cache later.
	 */
	cache?: string | boolean;
	cacheUpdate?: TCacheControll | TCacheControll[];
	cacheClear?: TCacheControll | TCacheControll[];
	forceRequest?: boolean;
	globalName?: string;
	queueThrottling?: boolean;
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
