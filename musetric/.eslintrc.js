const { getIgnorePatterns, getTsPath } = require('eslint-config-musetric/utils');

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
	overrides: [
		getTsPath(__dirname, '.'),
		{
			...getTsPath(__dirname, 'test'),
		},
		getTsPath(__dirname, 'performance'),
	],
};
