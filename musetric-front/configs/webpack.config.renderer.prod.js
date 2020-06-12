const merge = require('webpack-merge');
const config = require('./webpack.config.renderer');

module.exports = merge(config, {
	mode: "production"
});