const path = require('path');

module.exports = {
	entry: './src/main.ts',
	target: 'electron-main',
	module: {
		rules: [
			{ test: /\.ts$/, include: /src/, use: ['ts-loader']}
		]
	},
	output: {
		path: path.join(__dirname, '..', 'dist'),
		filename: 'main.js'
	}
}
