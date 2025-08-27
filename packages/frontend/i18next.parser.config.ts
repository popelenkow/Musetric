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

export default config;
