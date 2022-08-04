module.exports = {
	env: {
		browser: true,
		node: true,
		es6: true,
	},
	plugins: [
		'react',
		'import',
		'@typescript-eslint',
	],
	extends: [
		'airbnb',
		'airbnb/hooks',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 2018,
		sourceType: 'module',
	},
	overrides: [
		{
			files: ['*.ts', '*.tsx'],
			parserOptions: {
				project: './tsconfig.json',
			},
			extends: [
				'airbnb-typescript',
				'plugin:@typescript-eslint/recommended',
				'plugin:@typescript-eslint/recommended-requiring-type-checking',
			],
		},
		{
			files: ['*.js', '*.ts', '*.jsx', '*.tsx'],
			rules: {
				'import/prefer-default-export': 0,
				indent: ['error', 'tab', { SwitchCase: 1 }],
				'no-plusplus': 0,
				'no-tabs': 0,
				'object-curly-newline': 0,
				'arrow-body-style': 0,
				'no-param-reassign': 0,
				'no-bitwise': 0,
				'func-names': ['error'],
				'jsx-quotes': ['error', 'prefer-single'],
				'jsx-a11y/label-has-associated-control': [2, {
					labelComponents: ['CustomInputLabel'],
					labelAttributes: ['label'],
					controlComponents: ['CustomInput'],
					depth: 3,
				}],
				'react/jsx-indent': ['error', 'tab'],
				'react/jsx-props-no-spreading': 0,
				'react/jsx-indent-props': ['error', 'tab'],
				'react/require-default-props': 0,
				'@typescript-eslint/indent': ['error', 'tab'],
				'@typescript-eslint/no-useless-constructor': ['error'],
				'@typescript-eslint/member-delimiter-style': ['error', {
					multiline: {
						delimiter: 'comma',
						requireLast: true,
					},
					singleline: {
						delimiter: 'comma',
						requireLast: false,
					},
				}],
				'@typescript-eslint/no-empty-function': ['error'],
				'@typescript-eslint/consistent-type-assertions': ['error', {
					assertionStyle: 'never',
				}],
				'@typescript-eslint/consistent-type-definitions': ['error', 'type'],
				'@typescript-eslint/brace-style': ['error', 'stroustrup'],
			},
		},
		{
			files: ['*.js', '*.ts'],
			rules: {
				'func-style': ['error'],
			},
		},
		{
			files: ['*.jsx', '*.tsx'],
			rules: {
				'react/function-component-definition': [2, {
					namedComponents: ['function-declaration'],
				}],
			},
		},
	],
	ignorePatterns: ['dist/*'],
};
