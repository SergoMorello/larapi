import API from "../src";

type Test = {
	id: number;
	name: string;
}

test('set header', () => {
	API.get<Test>({
		path: '/',
		data: {
			
		},
		success(data, xhr) {
			data
		},
	}).promise.then((e) => {
		e
	});

	const api = new API({
		host: '',
		headers: {
			'test3': '321'
		}
	});
	api.setHeader('test2', '123');
	const getRequest = api.get({
		path: ''
	});
	const postRequest = api.post({
		path: '',
		headers: {
			'test4': '456'
		}
	});

	expect(postRequest.getHeader('Accept')).toBe('application/json');
	expect(postRequest.getHeader('Content-Type')).toBe('application/json');
	getRequest.setHeader('test', 'value');
	expect(getRequest.getHeader('test')).toBe('value');
	expect(postRequest.getHeader('test')).toBeUndefined();
	expect(getRequest.getHeader('test2')).toBe('123');
	
	getRequest.deleteHeader('test2');
	expect(getRequest.getHeader('test2')).toBeUndefined();
	expect(api.hasHeader('test2')).toBeTruthy();

	api.deleteHeader('test2');
	expect(api.hasHeader('test2')).toBeFalsy();
	expect(api.getHeader('test2')).toBeUndefined();

	expect(api.hasHeader('test3')).toBeTruthy();
	expect(getRequest.getHeader('test3')).toBe('321');

	expect(postRequest.hasHeader('test4')).toBeTruthy();
	postRequest.deleteHeader('test4');
	expect(postRequest.hasHeader('test4')).toBeFalsy();

	expect(api.getHeaders().length).toBe(3)
});