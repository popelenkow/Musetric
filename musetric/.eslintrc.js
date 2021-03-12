const path = require('path');

module.exports = {
	extends: [
		'musetric',
	],
	rules: {
		'import/no-cycle': 0,
		'jsx-a11y/label-has-associated-control': [2, {
			labelComponents: ['CustomInputLabel'],
			labelAttributes: ['label'],
			controlComponents: ['CustomInput'],
			depth: 3,
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
