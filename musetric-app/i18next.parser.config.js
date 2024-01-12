module.exports = {
    input: ['src/**/*.{ts,tsx}'],
    locales: ['en', 'ru'],
    defaultNamespace: 'MusetricApp',
    output: 'src/Resources/Locales/$LOCALE/$NAMESPACE.json',
    indentation: 4,
    sort: true,
};
