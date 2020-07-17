module.exports = {
	input: ['../src/**/*.{ts,tsx}'],
	locales: ['en', 'ru'],
	defaultNamespace: 'musetric',
	output: 'locale/$LOCALE/$NAMESPACE.json',
	sort: true
};