const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const HtmlPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const musetricAppPkg = require('./package.json');
const musetricPkg = require('./node_modules/musetric/package.json');

const createConfig = (options) => {
	const common = {
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
		},
		performance: {
			maxEntrypointSize: 2000000,
			maxAssetSize: 2000000,
		},
		stats: { modules: false, children: false, entrypoints: false },
		plugins: [
			new webpack.DefinePlugin({
				'process.env': {
					MUSETRIC_APP_VERSION: JSON.stringify(musetricAppPkg.version),
					MUSETRIC_VERSION: JSON.stringify(musetricPkg.version),
				},
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
			https: true,
			headers: {
				'Cross-Origin-Opener-Policy': 'same-origin',
				'Cross-Origin-Embedder-Policy': 'require-corp',
			},
		},
		stats: { assets: false },
		resolve: {
			modules: [path.join(__dirname, 'node_modules')],
			alias: {
				musetric: path.join(__dirname, '../musetric/src/'),
			},
		},
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
	const musetric = {
		entry: {
			musetricApp: './src/musetricApp.tsx',
		},
		output: {
			library: {
				type: 'umd',
			},
		},
	};
	const others = {
		entry: {
			musetricSplashScreen: './src/musetricSplashScreen.ts',
			musetricSpectrum: './src/musetricSpectrum.ts',
			musetricWavConverter: './src/musetricWavConverter.ts',
			index: './src/index.ts',
		},
		output: {
			library: {
				name: '_',
				type: 'var',
			},
		},
		plugins: [
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
		],
	};
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
