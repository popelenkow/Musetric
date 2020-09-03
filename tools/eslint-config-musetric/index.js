/* eslint quote-props:0 */
module.exports = {
	env: {
		browser: true,
		node: true,
		es6: true,
	},
	extends: [
		'airbnb',
		'plugin:react/recommended',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 6,
		sourceType: 'module',
	},
	plugins: [
		'react',
		'@typescript-eslint',
	],
	rules: {
		'arrow-parens': 0,
		'import/extensions': 0,
		'import/no-extraneous-dependencies': 0,
		'import/no-unresolved': 0,
		'import/prefer-default-export': 0,
		'indent': ['error', 'tab'],
		'jsx-quotes': ['error', 'prefer-single'],
		'linebreak-style': ['error', 'windows'],
		'no-plusplus': 0,
		'no-tabs': 0,
		'no-unused-vars': 0,
		'object-curly-newline': 0,
		'react/jsx-filename-extension': 0,
		'react/jsx-indent': ['error', 'tab'],
		'react/prop-types': 0,
		'react/jsx-props-no-spreading': 0,
	},
};
