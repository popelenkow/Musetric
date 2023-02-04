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
			files: ['*.ts', '*.tsx', '*.mts'],
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
			files: ['*.js', '*.jsx', '*.mjs', '*.ts', '*.tsx', '*.mts'],
			rules: {
				'import/prefer-default-export': 0,
				'import/order': ['error', {
					alphabetize: {
						order: 'asc',
						caseInsensitive: true,
					},
					'newlines-between': 'never',
				}],
				indent: ['error', 'tab', { SwitchCase: 1 }],
				'no-plusplus': 0,
				'no-tabs': 0,
				'object-curly-newline': 0,
				'arrow-body-style': 0,
				'no-param-reassign': 0,
				'no-bitwise': 0,
				'func-names': ['error'],
				'func-style': ['error'],
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
				'react/prop-types': 0,
				'react/function-component-definition': [2, {
					namedComponents: 'arrow-function',
				}],
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
				'@typescript-eslint/no-unused-vars': ['error'],
				'@typescript-eslint/type-annotation-spacing': 'error',
			},
		},
		{
			files: ['*.ts', '*.tsx', '*.mts'],
			rules: {
				'@typescript-eslint/explicit-function-return-type': 'error',
			},
		},
	],
	ignorePatterns: ['dist/*'],
};
