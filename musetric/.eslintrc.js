module.exports = {
	extends: [
		'musetric',
	],
	parserOptions: {
		tsconfigRootDir: __dirname,
	},
	rules: {
		'import/no-cycle': 0,
	},
};
