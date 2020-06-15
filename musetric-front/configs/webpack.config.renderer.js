const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
 
module.exports = {
	entry: './src/renderer.tsx',
	target: 'electron-renderer',
	resolve: {
		extensions: ['.js', '.ts', '.tsx']
	},
	module: {
		rules: [
		{
			test: /\.ts(x?)$/,
			include: /src/,
			use: [{ loader: 'ts-loader' }]
		},
		{
			test: /\.s[ac]ss$/i,
			use: [
				'style-loader',
				'css-loader',
				{
					loader: 'sass-loader',
					options: { 
						modules: true
					}
				}
			],
			
		}] 
	},
	output: {
		path: path.join(__dirname, '..', 'dist'),
		filename: 'renderer.js'
	},
	plugins: [
		new HtmlWebpackPlugin({
		template: './src/index.html'
		})
	]
}
