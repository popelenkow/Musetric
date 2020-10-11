const { merge } = require('webpack-merge');
const config = require('./webpack.config.main');

module.exports = merge(config, {
	mode: 'development',
	devtool: 'source-map',
});
