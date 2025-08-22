import API from "../src";

type Test = {
	id: number;
	name: string;
}

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