const { getIgnorePatterns, getTsPaths } = require('eslint-config-musetric/utils');

module.exports = {
	extends: [
		'musetric',
	],
	rules: {
		'react-hooks/exhaustive-deps': ['error', {
			additionalHooks: '(useLazyMemo)',
		}],
	},
	ignorePatterns: getIgnorePatterns(['dist'], ['build.js']),
	overrides: getTsPaths(__dirname, ['.', 'test', 'performance']),
};
