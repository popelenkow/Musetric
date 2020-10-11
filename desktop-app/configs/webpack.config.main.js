const path = require('path');

module.exports = {
	entry: './src/main.ts',
	target: 'electron-main',
	resolve: {
		extensions: ['.js', '.ts'],
	},
	module: {
		rules: [
			{ test: /\.ts$/, include: /src/, use: ['ts-loader'] },
		],
	},
	stats: { modules: false, entrypoints: false },
	output: {
		path: path.join(__dirname, '..', 'dist'),
		filename: 'main.js',
	},
};
