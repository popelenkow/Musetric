const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
	entry: ['./src/main.ts'],
	target: 'node',
	resolve: {
		extensions: ['.ts', '.js'],
	},
	module: {
		rules: [
			{ test: /\.ts$/, include: /src/, use: ['ts-loader'] },
		],
	},
	externals: [
		nodeExternals(),
	],
	stats: { modules: false, children: false, entrypoints: false },
	output: {
		path: path.join(__dirname, '..', 'dist'),
		filename: 'main.js',
	},
};
