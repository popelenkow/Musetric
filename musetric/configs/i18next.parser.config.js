module.exports = {
	input: ['../src/**/*.{ts,tsx}'],
	locales: ['en', 'ru'],
	defaultNamespace: 'musetric',
	output: 'publish/locale/$LOCALE/$NAMESPACE.json',
	indentation: '\t',
	sort: true
};