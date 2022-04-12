const { getIgnorePatterns, getTsPaths } = require('eslint-config-musetric/utils');

module.exports = {
	extends: [
		'musetric',
	],
	rules: {
		'react/function-component-definition': 0,
		'react/require-default-props': 0,
		'react-hooks/exhaustive-deps': ['error', {
			additionalHooks: '(useAnimation|useCache)',
		}],
	},
	ignorePatterns: getIgnorePatterns(['dist'], ['build.js']),
	overrides: getTsPaths(__dirname, ['.', 'test', 'performance']),
};
