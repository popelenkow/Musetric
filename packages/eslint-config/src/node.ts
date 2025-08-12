import globals from 'globals';
import tsEslint from 'typescript-eslint';
import { baseConfig } from './base';

export const config = tsEslint.config({
  ...baseConfig,
  languageOptions: {
    ...baseConfig.languageOptions,
    globals: globals.node,
  },
});
