const path = require('path');
const { spawn } = require('child_process');
const merge = require('webpack-merge');
const config = require('./webpack.config.renderer');

module.exports = merge(config, {
	mode: "development",
	devtool: 'source-map',
	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		port: 8080,
		before: (app, server, compiler) => {
			let done = false;
			compiler.hooks.done.tap('main', () => {
				if (done) return;
				done = true;
				console.log('Starting Main Process...');
				spawn('yarn', ['dev-main'], { shell: true, env: process.env, stdio: 'inherit' })	
					.on('close', code => process.exit(code))
					.on('error', spawnError => console.error(spawnError));
				compiler.hooks.done.rem
			})
			
		}
	}
});