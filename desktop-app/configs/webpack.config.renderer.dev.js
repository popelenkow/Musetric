const path = require('path');
const { spawn } = require('child_process');
const { merge } = require('webpack-merge');
const config = require('./webpack.config.renderer');

const runOnDoneOnce = (compiler, run) => {
	let done = false
	compiler.hooks.done.tap('run-main', () => {
		!done && run()
		done = true; 
	})
}

module.exports = merge(config, {
	mode: "development",
	devtool: 'source-map',
	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		port: 8080,
		before: (_app, _server, compiler) => process.env.WITH_MAIN && runOnDoneOnce(compiler, () => {
			console.log('Starting Main Process...');
			spawn('yarn', ['dev-main'], { shell: true, env: process.env, stdio: 'inherit' })	
				.on('close', code => process.exit(code))
				.on('error', spawnError => console.error(spawnError));
		})
	},
	/*resolve: {
		alias: {
			'react': path.resolve(__dirname, '../node_modules/react'),
			'react-i18next': path.resolve(__dirname, '../node_modules/react-i18next'),
			'musetric': path.join(__dirname, '../../musetric/src')
		}
	},*/
});