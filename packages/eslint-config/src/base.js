import eslint from '@eslint/js';
import importPlugin from 'eslint-plugin-import-x';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tsEslint from 'typescript-eslint';

export const baseConfig = {
  extends: [eslint.configs.recommended, ...tsEslint.configs.recommended],
  files: ['**/*.ts'],
  ignores: ['**/*.config.ts'],
  languageOptions: {
    ecmaVersion: 2024,
    sourceType: 'module',
    parserOptions: { project: true },
  },
  plugins: {
    'import-x': importPlugin,
    'simple-import-sort': simpleImportSort,
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
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-use-before-define': ['error'],
    'func-style': ['error'],
    'func-names': ['error'],
    'import-x/order': [
      'error',
      {
        alphabetize: { order: 'asc', caseInsensitive: true },
        'newlines-between': 'never',
      },
    ],
    'simple-import-sort/exports': 'error',
    'object-shorthand': ['error', 'always'],
  },
};
