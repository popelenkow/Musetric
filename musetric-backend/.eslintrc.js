const { getIgnorePatterns } = require('eslint-config-musetric/utils');

module.exports = {
	extends: [
		'musetric',
	],
	rules: {
		'import/no-extraneous-dependencies': 0,
		'no-console': 0,
	},
	ignorePatterns: getIgnorePatterns(['dist'], []),
	parserOptions: {
		tsconfigRootDir: __dirname,
	},
};
