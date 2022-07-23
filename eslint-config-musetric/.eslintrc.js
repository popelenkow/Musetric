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
		'eslint:recommended',
		'plugin:react/recommended',
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
				'plugin:@typescript-eslint/eslint-recommended',
				'plugin:@typescript-eslint/recommended',
				'plugin:@typescript-eslint/recommended-requiring-type-checking',
				'plugin:import/typescript',
			],
		},
		{
			files: ['*.js', '*.ts', '*.tsx'],
			rules: {
				'import/prefer-default-export': 0,
				indent: ['error', 'tab', { SwitchCase: 1 }],
				'@typescript-eslint/indent': ['error', 'tab'],
				'jsx-quotes': ['error', 'prefer-single'],
				'no-plusplus': 0,
				'no-tabs': 0,
				'object-curly-newline': 0,
				'react/jsx-indent': ['error', 'tab'],
				'react/jsx-props-no-spreading': 0,
				'@typescript-eslint/no-useless-constructor': ['error'],
				'@typescript-eslint/member-delimiter-style': ['error'],
				'@typescript-eslint/no-empty-function': ['error'],
				'react/jsx-indent-props': ['error', 'tab'],
				'arrow-body-style': 0,
				'no-param-reassign': 0,
				'no-bitwise': 0,
				'jsx-a11y/label-has-associated-control': [2, {
					labelComponents: ['CustomInputLabel'],
					labelAttributes: ['label'],
					controlComponents: ['CustomInput'],
					depth: 3,
				}],
			},
		},
	],
	ignorePatterns: ['dist/*'],
};
