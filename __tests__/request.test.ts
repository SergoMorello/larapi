import API from "../src";

test('get request', () => {
	const request = API.get({
		path: '',
		data: {
			test: 123,
			test2: {
				test3: 321
			},
			test4: [
				1,
				2,
				3
			]
		}
	});
	expect(request.url).toBe('?test=123&test2[test3]=321&test4[]=1&test4[]=2&test4[]=3');
});