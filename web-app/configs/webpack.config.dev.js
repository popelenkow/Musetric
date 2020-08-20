const path = require('path');
const { merge } = require('webpack-merge');
const config = require('./webpack.config');

module.exports = merge(config, {
	mode: "development",
	devtool: 'source-map',
	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		port: 8080
	},
	resolve: {
		alias: {
			'react': path.resolve(__dirname, '../node_modules/react'),
			'react-i18next': path.resolve(__dirname, '../node_modules/react-i18next'),
			'musetric': path.join(__dirname, '../../musetric/src')
		}
	},
});