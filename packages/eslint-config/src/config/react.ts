import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';
import { ConfigWithExtends } from 'typescript-eslint';
import { tsConfig } from './ts.js';

export const reactConfig: ConfigWithExtends = {
  ...tsConfig,
  files: ['**/*.{ts,tsx}'],
  languageOptions: {
    ...tsConfig.languageOptions,
  },
  plugins: {
    ...tsConfig.plugins,
    react: reactPlugin,
    'react-hooks': reactHooksPlugin,
    'react-refresh': reactRefreshPlugin,
  },
  settings: {
    ...tsConfig.settings,
    react: { version: 'detect' },
  },
  rules: {
    ...tsConfig.rules,
    ...reactPlugin.configs.recommended.rules,
    ...reactPlugin.configs['jsx-runtime'].rules,
    ...reactHooksPlugin.configs.recommended.rules,
    'jsx-quotes': ['error', 'prefer-single'],
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/forbid-component-props': ['error', { forbid: ['spacing'] }],
  },
};
