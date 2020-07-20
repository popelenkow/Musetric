const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
	entry: './src/renderer.tsx',
	target: 'electron-renderer',
	resolve: {
		extensions: ['.js', '.ts', '.tsx']
	},
	module: {
		rules: [
			{ test: /\.(ts|tsx)$/, include: /src/, use: ['ts-loader'] },
			{ test: /\.(css|scss)$/, use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'] }
		] 
	},
	output: {
		path: path.join(__dirname, '..', 'dist'),
		filename: 'renderer.js'
	},
	stats: { modules: false, children: false, entrypoints: false },
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.html',
			filename: 'index.html'
		}),
		new MiniCssExtractPlugin({
			filename: 'renderer.css'
		}),
	]
}