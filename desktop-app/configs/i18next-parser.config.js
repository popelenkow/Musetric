module.exports = {
	input: ['../src/**/*.{ts,tsx}'],
	locales: ['en', 'ru'],
	defaultNamespace: 'musetric',
	output: 'src/locale/$LOCALE/$NAMESPACE.json',
	sort: true
};