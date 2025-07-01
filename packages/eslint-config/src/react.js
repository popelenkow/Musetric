import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tsEslint from 'typescript-eslint';
import { baseConfig } from './base.js';

export default tsEslint.config({
  ...baseConfig,
  files: ['**/*.{ts,tsx}'],
  languageOptions: {
    ...baseConfig.languageOptions,
    globals: globals.browser,
  },
  plugins: {
    ...baseConfig.plugins,
    react: reactPlugin,
    'react-hooks': reactHooksPlugin,
    'react-refresh': reactRefreshPlugin,
  },
  settings: {
    ...baseConfig.settings,
    react: { version: 'detect' },
  },
  rules: {
    ...baseConfig.rules,
    ...reactPlugin.configs.recommended.rules,
    ...reactPlugin.configs['jsx-runtime'].rules,
    ...reactHooksPlugin.configs.recommended.rules,
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'jsx-quotes': ['error', 'prefer-single'],
  },
});
