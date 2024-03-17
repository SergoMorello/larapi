export type TCacheBody = {
	data: any;
	group?: string;
	time: number;
}

export type TUser = {
	id: number;
	[index: string]: any;
};

export type TCache = {
	[index: string]: TCacheBody;
}

export type TError = {
	message?: string;
}

export type TData = {
	[index: string]: any | ((...args: any) => any);
}

export type TGroupsData = {
	[index: string]: TData;
}

export type TMethod = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'CONNECT' | 'TRACE';

export type TCacheControll = string | {
	group: string;
	fieldKey: string;
};

export type TRequestProgress = {
	percent: number;
	total: number;
	loaded: number;
}

export type TConfigDataReplace = {
	[index: string]: (value: any) => any;
};

export type TConfig = {
	host: string;
	dataReplaceCallback?: (this: any, key: string, value: any) => any;
	dataReplace?: TConfigDataReplace;
};

export type TResponseData = {
	success: TData;
	error?: TError;
	fail?: TError;
};

export type TParams<P = string | keyof TResponseData['success'], D extends ((...args: any) => any) = TResponseData['success']['?'] | ((...args: any) => any),  M extends TMethod = TMethod, E extends TError = TError, F extends TError = TError> = {
	path: P;
	data?: Parameters<D>[0];
	cache?: string | boolean;
	cacheUpdate?: TCacheControll | TCacheControll[];
	cacheClear?: TCacheControll | TCacheControll[];
	globalName?: string;
	queueThrottling?: boolean;
	success?: (data: ReturnType<D>) => void;
	error?: (error: E) => void;
	fail?: (fail: F) => void;
	complete?: (complete: any) => void;
	progress?: (progress: TRequestProgress) => void;
}

export type TRequestParams = {
	method: TMethod;
	headers?: {
		[index: string]: string;
	};
	body?: string;
	withoutResponse?: boolean;
}

export type TListenerEvents = 'api-request-success' | 'api-request-fail' | 'api-request-error' | 'api-request-complete' | 'api-request-progress' | 'login' | 'logout' | 'user-update';