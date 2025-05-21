import eslint from '@eslint/js';
import importPlugin from 'eslint-plugin-import-x';
import tsEslint from 'typescript-eslint';

export const baseConfig = {
  extends: [eslint.configs.recommended, ...tsEslint.configs.recommended],
  files: ['**/*.ts'],
  ignores: ['dist'],
  languageOptions: {
    ecmaVersion: 2024,
    sourceType: 'module',
  },
  plugins: {
    'import-x': importPlugin,
  },
  settings: {
    'import-x/resolver': { typescript: true },
  },
  rules: {
    ...importPlugin.configs.recommended.rules,
    '@typescript-eslint/consistent-type-assertions': [
      'error',
      { assertionStyle: 'never' },
    ],
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    '@typescript-eslint/no-empty-function': ['error'],
    '@typescript-eslint/no-unused-vars': ['error'],
    '@typescript-eslint/no-useless-constructor': ['error'],
    '@typescript-eslint/no-shadow': ['error'],
    '@typescript-eslint/no-namespace': 'off',
    'func-style': ['error'],
    'func-names': ['error'],
    'import-x/order': [
      'error',
      {
        alphabetize: { order: 'asc', caseInsensitive: true },
        'newlines-between': 'never',
      },
    ],
  },
};
