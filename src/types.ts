export type TCacheBody = {
	data: any;
	group?: string;
	time: number;
}

export type TCache = {
	[index: string]: TCacheBody;
}

export type TData = {
	[index: string]: any;
}

export type TGroupsData = {
	[index: string]: TData;
}

export type TMethod = 'GET' | 'POST';

export type TParams = {
	path: string;
	data?: TData;
	cache?: string | boolean;
	globalName?: string;
	success?: (...args: any) => void;
	error?: (...args: any) => void;
	fail?: (...args: any) => void;
	complete?: (...args: any) => void;
}

export type TRequestParams = {
	method: TMethod;
	headers?: {
		[index: string]: string;
	};
	body?: string;
}

export type TListenerEvents = 'api-request-fail' | 'api-request-error' | 'api-request-complete' | 'login' | 'logout' | 'user-update';