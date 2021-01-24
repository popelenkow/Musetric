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
	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		port: 8080,
		stats: { modules: false, children: false, entrypoints: false },
	},
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
		modules: [path.join(__dirname, '../node_modules')],
		alias: {
			musetric: path.join(__dirname, '../../musetric/src'),
		},
	},
});
