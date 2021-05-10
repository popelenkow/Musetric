const path = require('path');
const webpack = require('webpack');
const { spawn } = require('child_process');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const musetricAppPkg = require('./package.json');
const musetricPkg = require('./node_modules/musetric/package.json');

const common = {
	entry: './src/index.tsx',
	resolve: {
		extensions: ['.js', '.ts', '.tsx'],
	},
	module: {
		rules: [
			{ test: /\.(ts|tsx)$/, include: /src/, use: ['ts-loader'] },
		],
	},
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'index.js',
	},
	stats: { modules: false, children: false, entrypoints: false, assets: false },
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				MUSETRIC_APP_VERSION: JSON.stringify(musetricAppPkg.version),
				MUSETRIC_VERSION: JSON.stringify(musetricPkg.version),
			},
		}),
		new HtmlWebpackPlugin({
			template: './src/index.html',
			filename: 'index.html',
		}),
	],
};

const specific = process.env.DEV ? {
	mode: 'development',
	devtool: 'source-map',
	devServer: {
		hot: true,
		compress: true,
		port: 3000,
	},
	resolve: {
		modules: [path.join(__dirname, 'node_modules')],
		alias: {
			musetric: path.join(__dirname, '../musetric/src'),
		},
	},
} : {
	mode: 'production',
	performance: {
		maxEntrypointSize: 2000000,
		maxAssetSize: 2000000,
	},
	plugins: process.env.SIZE ? [new BundleAnalyzerPlugin()] : [],
};

module.exports = merge(common, specific);
