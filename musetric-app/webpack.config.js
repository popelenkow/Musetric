const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const HtmlPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const musetricAppPkg = require('./package.json');
const musetricPkg = require('./node_modules/musetric/package.json');

const createConfig = ({ entry, library }) => {
	const copyWorklet = process.env.WORKLET ? [] : [
		new CopyPlugin({
			patterns: [
				{ from: './dist/musetricRecorder.js', to: './musetricRecorder.js' },
			],
		}),
	];
	const common = {
		entry,
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
			filename: '[name].js',
			library,
		},
		performance: {
			maxEntrypointSize: 2000000,
			maxAssetSize: 2000000,
		},
		stats: { modules: false, children: false, entrypoints: false, assets: false },
		plugins: [
			new webpack.DefinePlugin({
				'process.env': {
					MUSETRIC_APP_VERSION: JSON.stringify(musetricAppPkg.version),
					MUSETRIC_VERSION: JSON.stringify(musetricPkg.version),
				},
			}),
			new HtmlPlugin({
				template: './src/index.html',
				filename: 'index.html',
				inject: false,
				minify: {
					collapseWhitespace: false,
				},
			}),
			new CopyPlugin({
				patterns: [
					{ from: './src/favicon.ico', to: './favicon.ico' },
				],
			}),
			...copyWorklet,
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
		plugins: process.env.SIZE ? [new BundleAnalyzerPlugin()] : [],
	};
	return merge(common, specific);
};

const createConfigs = (args) => {
	const configs = [];
	for (let i = 0; i < args.length; i++) {
		const result = createConfig(args[i]);
		if (i !== 0) delete result.devServer;
		configs.push(result);
	}
	return configs;
};

module.exports = createConfigs(process.env.WORKLET ? [
	{
		entry: {
			musetricRecorder: './src/musetricRecorder.ts',
		},
		library: {
			name: '_',
			type: 'var',
		},
	},
] : [
	{
		entry: {
			musetricApp: './src/musetricApp.tsx',
		},
		library: {
			type: 'umd',
		},
	},
	{
		entry: {
			splashScreen: './src/splashScreen.ts',
			musetricWavConverter: './src/musetricWavConverter.ts',
			index: './src/index.ts',
		},
		library: {
			name: '_',
			type: 'var',
		},
	},
]);
