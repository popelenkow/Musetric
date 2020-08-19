module.exports = {
	input: ['../src/**/*.{ts,tsx}'],
	locales: ['en', 'ru'],
	defaultNamespace: 'musetric',
	output: 'locales/$LOCALE/$NAMESPACE.json',
	indentation: '\t',
	sort: true
};