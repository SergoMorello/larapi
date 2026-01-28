import type { Configuration } from 'webpack';
import path from 'path';

const config: Configuration = {
	entry: {
		index: '/src/index.ts',
	},
	target: 'web',
	mode: 'production',
	devtool: "source-map",
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: [
					'ts-loader'
				],
				exclude: /node_modules/,
			}
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},

	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist'),
		library: 'API',
		libraryTarget: 'umd',
		globalObject: 'typeof self !== "undefined" ? self : this',
		auxiliaryComment: 'API client for laravel'
	}
};

export default config;