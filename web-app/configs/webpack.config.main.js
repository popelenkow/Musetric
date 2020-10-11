const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
	entry: ['webpack/hot/poll?100', './src/main.ts'],
	target: 'node',
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},
	module: {
		rules: [
			{ test: /\.ts$/, include: /src/, use: ['ts-loader'] },
		],
	},
	externals: [
		nodeExternals({
			allowlist: ['webpack/hot/poll?100'],
		}),
	],
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
	],
	stats: { modules: false, children: false, entrypoints: false },
	output: {
		path: path.join(__dirname, '..', 'dist'),
		filename: 'main.js',
	},
};
