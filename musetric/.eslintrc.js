const { getIgnorePatterns, getTsPaths } = require('eslint-config-musetric/utils');

module.exports = {
	extends: [
		'musetric',
	],
	rules: {
		'react/require-default-props': 0,
		'react-hooks/exhaustive-deps': ['error', {
			additionalHooks: '(useAnimation|useLazyMemo)',
		}],
		// '@typescript-eslint/explicit-function-return-type': 'error',
	},
	ignorePatterns: getIgnorePatterns(['dist'], ['build.js']),
	overrides: getTsPaths(__dirname, ['.', 'test', 'performance']),
};
