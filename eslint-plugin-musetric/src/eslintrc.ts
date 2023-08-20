export const recommended =  {
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
				'@typescript-eslint/brace-style': ['error', 'stroustrup'],
				'@typescript-eslint/consistent-type-assertions': ['error', {
					assertionStyle: 'never',
				}],
				'@typescript-eslint/consistent-type-definitions': ['error', 'type'],
				'@typescript-eslint/indent': ['error', 'tab'],
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
				'@typescript-eslint/no-unused-vars': ['error'],
				'@typescript-eslint/no-useless-constructor': ['error'],
				'@typescript-eslint/type-annotation-spacing': 'error',
				'arrow-body-style': 0,
				'func-names': ['error'],
				'func-style': ['error'],
				'import/order': ['error', {
					alphabetize: {
						order: 'asc',
						caseInsensitive: true,
					},
					'newlines-between': 'never',
				}],
				'import/prefer-default-export': 0,
				'jsx-a11y/label-has-associated-control': [2, {
					labelComponents: ['CustomInputLabel'],
					labelAttributes: ['label'],
					controlComponents: ['CustomInput'],
					depth: 3,
				}],
				'jsx-quotes': ['error', 'prefer-single'],
				'no-bitwise': 0,
				'no-param-reassign': 0,
				'no-plusplus': 0,
				'no-tabs': 0,
				'object-curly-newline': 0,
				'react/function-component-definition': [2, {
					namedComponents: 'arrow-function',
				}],
				'react/jsx-curly-spacing': ['error', { when: 'never', children: true }],
				'react/jsx-indent': ['error', 'tab'],
				'react/jsx-indent-props': ['error', 'tab'],
				'react/jsx-props-no-spreading': 0,
				'react/prop-types': 0,
				'react/require-default-props': 0,
				'musetric/yieldStarRequired': 'error',
				indent: ['error', 'tab', { SwitchCase: 1 }],
			},
		},
		{
			files: ['*.ts', '*.tsx', '*.mts'],
			rules: {
				'@typescript-eslint/explicit-function-return-type': [
					'error',
				],
				'@typescript-eslint/comma-dangle': [
					'error',
					{
						arrays: 'always-multiline',
						objects: 'always-multiline',
						imports: 'always-multiline',
						exports: 'always-multiline',
						functions: 'always-multiline',
						generics: 'always-multiline',
						enums: 'always-multiline',
						tuples: 'always-multiline',
					},
				],
			},
		},
		{
			files: ['*.tsx'],
			rules: {
				'@typescript-eslint/comma-dangle': [
					'error',
					{
						arrays: 'always-multiline',
						objects: 'always-multiline',
						imports: 'always-multiline',
						exports: 'always-multiline',
						functions: 'always-multiline',
						generics: 'ignore',
						enums: 'always-multiline',
						tuples: 'always-multiline',
					},
				],
			},
		},
	],
	ignorePatterns: ['dist/*'],
};
