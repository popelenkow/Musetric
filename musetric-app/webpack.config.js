/** @typedef {import("webpack").Configuration} Configuration */
/** @typedef {import("webpack-dev-server").Configuration} DevServerConfiguration */

const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const CopyPlugin = require('copy-webpack-plugin');
const { createDtsBundlePlugin } = require('./DtsBundlePlugin');
const musetricAppPkg = require('./package.json');

const createConfig = (options) => {
	/** @type {Configuration} */
	const common = {
		resolve: {
			extensions: ['.js', '.ts', '.tsx'],
			modules: [
				path.resolve(__dirname, './src'),
				path.resolve(__dirname, './node_modules'),
			],
			alias: {
				musetric: path.resolve(__dirname, '../musetric/src/'),
			},
		},
		module: {
			rules: [
				{
					test: /\.(ts|tsx)$/,
					exclude: /node_modules/,
					use: {
						loader: 'ts-loader',
						options: {
							projectReferences: true,
						},
					},
				},
			],
		},
		output: {
			path: path.resolve(__dirname, 'dist'),
			filename: '[name].js',
		},
		performance: {
			maxEntrypointSize: 2000000,
			maxAssetSize: 2000000,
		},
		stats: { modules: false, children: false, entrypoints: false },
		plugins: [
			new webpack.DefinePlugin({
				'process.env': {
					APP_VERSION: JSON.stringify(musetricAppPkg.version),
				},
			}),
		],
	};

	/** @type {Configuration} */
	const specific = process.env.DEV ? {
		mode: 'development',
		devtool: 'source-map',
		/** @type {DevServerConfiguration} */
		devServer: {
			hot: 'only',
			port: 3000,
			https: true,
			headers: {
				'Cross-Origin-Opener-Policy': 'same-origin',
				'Cross-Origin-Embedder-Policy': 'require-corp',
			},
		},
		stats: { assets: false },
	} : {
		mode: 'production',
	};
	return merge(common, options, specific);
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

const create = () => {
	/** @type {Configuration} */
	const worklet = {
		entry: {
			musetricRecorder: './src/musetricRecorder.ts',
		},
		output: {
			library: {
				name: '_',
				type: 'var',
			},
		},
	};
	/** @type {Configuration} */
	const musetric = {
		entry: {
			musetricTheme: './src/musetricTheme.ts',
			musetricLocale: './src/musetricLocale.ts',
			musetricIcon: './src/musetricIcon.tsx',
			musetricApp: './src/musetricApp.tsx',
		},
		output: {
			library: {
				type: 'umd',
			},
		},
		plugins: [
			createDtsBundlePlugin(),
		],
	};
	/** @type {Configuration} */
	const others = {
		entry: {
			musetricSplashScreen: './src/musetricSplashScreen.ts',
			musetricSpectrum: './src/musetricSpectrum.ts',
			musetricWavConverter: './src/musetricWavConverter.ts',
			perf: './src/perf.ts',
			index: './src/index.ts',
		},
		output: {
			library: {
				name: '_',
				type: 'var',
			},
		},
		plugins: [
			new CopyPlugin({
				patterns: [
					{ from: './src/index.html', to: './index.html' },
					{ from: './src/perf.html', to: './perf.html' },
					{ from: './src/favicon.ico', to: './favicon.ico' },
					{ from: './package.json', to: './package.json' },
					{ from: '../licence.txt', to: './licence.txt' },
					{ from: './readme.md', to: './readme.md' },
				],
			}),
		],
	};
	/** @type {Configuration} */
	const copyWorklet = {
		plugins: [
			new CopyPlugin({
				patterns: [
					{ from: './dist/musetricRecorder.js', to: './musetricRecorder.js' },
					{ from: './dist/musetricRecorder.js.map', to: './musetricRecorder.js.map' },
				],
			}),
		],
	};
	if (process.env.WORKLET) {
		return [worklet];
	}
	if (process.env.DEV) {
		return [merge(musetric, copyWorklet), others];
	}
	return [worklet, musetric, others];
};

module.exports = createConfigs(create());
