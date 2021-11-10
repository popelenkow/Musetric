const { getIgnorePatterns } = require('eslint-config-musetric/utils');

module.exports = {
	extends: [
		'musetric',
	],
	rules: {
		'import/no-extraneous-dependencies': 0,
		'@typescript-eslint/no-unsafe-member-access': 0,
		'@typescript-eslint/no-unsafe-call': 0,
		'@typescript-eslint/no-unsafe-assignment': 0,
		'@typescript-eslint/no-unsafe-return': 0,
	},
	ignorePatterns: getIgnorePatterns(['dist'], []),
	parserOptions: {
		tsconfigRootDir: __dirname,
	},
};
