module.exports = {
	input: ['src/**/*.{ts,tsx}'],
	locales: ['en', 'ru'],
	defaultNamespace: 'musetric',
	output: 'src/Locales/$LOCALE/$NAMESPACE.json',
	indentation: '\t',
	sort: true,
};
