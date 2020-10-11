/* eslint-disable no-console */
const path = require('path');
const { spawn } = require('child_process');
const { merge } = require('webpack-merge');
const config = require('./webpack.config.renderer');

const runOnce = (compiler, run) => {
	let done = false;
	compiler.hooks.done.tap('run-main', () => {
		!done && run();
		done = true;
	});
};

module.exports = merge(config, {
	mode: 'development',
	devtool: 'source-map',
	plugins: [
		{
			apply: (compiler) => process.env.WITH_MAIN && runOnce(compiler, () => {
				console.log('Starting Main Process...');
				spawn('yarn', ['dev-main'], { shell: true, env: process.env, stdio: 'inherit' })
					.on('close', code => process.exit(code))
					.on('error', spawnError => console.error(spawnError));
			}),
		},
	],
	resolve: {
		alias: {
			'react': path.resolve(__dirname, '../node_modules/react'),
			'react-i18next': path.resolve(__dirname, '../node_modules/react-i18next'),
			'musetric': path.join(__dirname, '../../musetric/src'),
		},
	},
});