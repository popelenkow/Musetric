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
	stats: { modules: false, children: false, entrypoints: false },
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

const runOnce = (compiler, run) => {
	let done = false;
	compiler.hooks.done.tap('run-host', () => {
		!done && run();
		done = true;
	});
};

const specific = process.env.DEV ? {
	mode: 'development',
	devtool: 'source-map',
	plugins: [
		{
			apply: (compiler) => process.env.DEV && runOnce(compiler, () => {
				console.log('Starting Host Process...');
				spawn('node', ['host.js'], { shell: true, env: process.env, stdio: 'inherit' })
					.on('close', code => process.exit(code))
					.on('error', spawnError => console.error(spawnError));
			}),
		},
	],
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
