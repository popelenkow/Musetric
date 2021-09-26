module.exports = {
	extends: [
		'musetric',
	],
	rules: {
		'import/no-extraneous-dependencies': 0,
	},
	parserOptions: {
		EXPERIMENTAL_useSourceOfProjectReferenceRedirect: true,
		tsconfigRootDir: __dirname,
	},
};
