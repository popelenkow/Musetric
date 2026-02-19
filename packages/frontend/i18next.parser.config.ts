import type { UserConfig } from 'i18next-parser';

const config: UserConfig = {
  input: ['src/**/*.{ts,tsx}'],
  locales: ['en'],
  output: 'src/translations/$LOCALE.json',
  indentation: 2,
  sort: true,
  createOldCatalogs: false,
  keySeparator: false,
};

// eslint-disable-next-line no-restricted-exports
export default config;
