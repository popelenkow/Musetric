module.exports = {
	input: ['../src/**/*.{ts,tsx}'],
	locales: ['en', 'ru'],
	defaultNamespace: 'musetric',
	output: 'src/locales/$LOCALE/$NAMESPACE.json',
	indentation: '\t',
	sort: true,
};
