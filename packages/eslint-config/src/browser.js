import globals from 'globals';
import tsEslint from 'typescript-eslint';
import { baseConfig } from './base.js';

export default tsEslint.config({
  ...baseConfig,
  languageOptions: {
    ...baseConfig.languageOptions,
    globals: globals.browser,
  },
});
