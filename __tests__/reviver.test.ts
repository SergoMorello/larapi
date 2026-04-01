import API from "../src";


test('reviver function', async () => {
	const api = new API({
		host: 'https://jsonplaceholder.typicode.com',
		reviver: (key, value) => {
			if (key === 'completed') {
				return true;
			}
			if (key === 'title' && value === 'Test2') {
				return 'Revived Title';
			}
			return value;
		}
	});

	api.setGlobalInitData('reviver-test', {
		items: [
			{ id: 1, title: 'Test', completed: false },
			{ id: 2, title: 'Test2', completed: true }
		]
	});
	
	const data = await api.get({
		path: '/todos/1',
		cache: true,
		globalName: 'reviver-test',
		success: (data) => {
			console.log(data)
		},
		fail: (error) => {
			console.log(error)
		}
	}).promise
	console.log(data)
	expect(Array.isArray(data?.items)).toBe(true);
	expect(data?.items[0].completed).toBe(true);
	expect(data?.items[1].title).toBe('Revived Title');
});

test('reviver data', async () => {
	const toImage = (obj: any) => {
			return {
				...obj,
				revived: true
			};
	}
	const toImages = (obj: any) => {
		if (Array.isArray(obj)) {
			return obj.map((o) => toImage(o))
		}
	}
	const api = new API({
		host: 'https://jsonplaceholder.typicode.com',
		dataReviver: {
			image: toImage,
			images: toImages,
			'id&route&ext': toImage
		}
	});

	api.setGlobalInitData('reviver-test', {
		items: [
			{ id: 1, title: 'Test', completed: false },
			{
				id: 2,
				title: 'Test2',
				completed: true,
				images: [
					{
						id: 1,
						route: '/images/test.png',
						ext: 'png'
					},
					{
						id: 2,
						route: '/images/test.png',
						ext: 'png'
					}
				],
				image: {
					id: 1,
					route: '/images/test.png',
					ext: 'png'
				}
			}
		]
	});

	api.setGlobalInitData('reviver-test2', {
		id: 1,
		route: '/images/test.png',
		ext: 'png'
	} as any);

	api.setGlobalInitData('reviver-test3', [
		{
			id: 2,
			route: '/images/test2.png',
			ext: 'png'
		},
		{
			id: 3,
			route: '/images/test3.jpg',
			ext: 'jpg'
		},
		{
			id: 4,
			title: 'test'
		}
	] as any);
	
	const data1 = await api.get({
		path: '/todos/1',
		cache: true,
		globalName: 'reviver-test',
		success: (data) => {
			console.log(data)
		},
		fail: (error) => {
			console.log(error)
		}
	}).promise
	
	expect(Array.isArray(data1?.items)).toBe(true);
	expect(data1?.items[1].image.revived).toBe(true);

	const data2 = await api.get({
		path: '/todos',
		cache: true,
		globalName: 'reviver-test2',
		success: (data) => {
			console.log(data)
		},
		fail: (error) => {
			console.log(error)
		}
	}).promise

	expect(data2?.revived).toBe(true);

	const data3 = await api.get({
		path: '/todos',
		cache: true,
		globalName: 'reviver-test3',
		success: (data) => {
			console.log(data)
		},
		fail: (error) => {
			console.log(error)
		}
	}).promise
	console.log(data3)
	expect(data3.at(0)?.revived).toBe(true);
	expect(data3.at(1)?.revived).toBe(true);
});