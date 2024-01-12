export default {
    input: ['src/**/*.{ts,tsx}'],
    locales: ['en', 'ru'],
    defaultNamespace: 'MusetricApp',
    output: 'src/app/translations/$LOCALE.json',
    indentation: 4,
    sort: true,
};
