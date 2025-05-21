export default {
  input: ['src/**/*.{ts,tsx}'],
  locales: ['en'],
  output: 'src/translations/$LOCALE.json',
  indentation: 2,
  sort: true,
  createOldCatalogs: false,
  keySeparator: false,
};
