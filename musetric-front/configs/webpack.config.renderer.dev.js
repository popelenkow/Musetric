const path = require('path');
const { spawn } = require('child_process');
const merge = require('webpack-merge');
const config = require('./webpack.config.renderer');
var waitOn = require('wait-on');

const runMain = () => {
	waitOn({ resources: ['http://localhost:8080/']}).then(() => {
		console.log('Starting Main Process...');
		spawn('yarn', ['dev-main'], { shell: true, env: process.env, stdio: 'inherit' })	
			.on('close', code => process.exit(code))
			.on('error', spawnError => console.error(spawnError));
	})
}

module.exports = merge(config, {
	mode: "development",
	devtool: 'source-map',
	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		port: 8080,
		noInfo: true,
		before: () => process.env.WITH_MAIN && runMain()
	}
});