const path = require('path');

module.exports = {
	extends: [
		'musetric',
	],
	rules: {
		'react-hooks/exhaustive-deps': ['error', {
			additionalHooks: '(useAnimation)',
		}],
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
		{
			files: ['performance/**/*.js', 'performance/**/*.ts', 'performance/**/*.tsx'],
			parserOptions: {
				tsconfigRootDir: path.join(__dirname, 'performance'),
			},
		},
	],
};
