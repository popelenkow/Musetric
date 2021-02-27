const path = require('path');

module.exports = {
	extends: [
		'musetric',
	],
	rules: {
		'import/no-cycle': 0,
	},
	overrides: [
		{
			files: ['src/**/*.js', 'src/**/*.ts', 'src/**/*.tsx'],
			parserOptions: {
				tsconfigRootDir: __dirname,
			},
		},
		{
			files: ['test/**/*.js', 'test/**/*.ts', 'test/**/*.tsx'],
			parserOptions: {
				tsconfigRootDir: path.join(__dirname, 'test'),
			},
		},
	],
};
