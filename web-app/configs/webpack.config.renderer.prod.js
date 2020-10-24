const { merge } = require('webpack-merge');
const config = require('./webpack.config.renderer');

module.exports = merge(config, {
	mode: 'production',
	performance: {
		maxEntrypointSize: 1000000,
		maxAssetSize: 1000000,
	},
});
