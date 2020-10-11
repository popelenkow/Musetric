const StartServerPlugin = require('start-server-webpack-plugin');
const { merge } = require('webpack-merge');
const config = require('./webpack.config.main');

module.exports = merge(config, {
	mode: 'development',
	watch: true,
	plugins: [
		new StartServerPlugin({ name: 'main.js' }),
	],
});
