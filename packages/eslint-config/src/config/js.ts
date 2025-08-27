import eslint from '@eslint/js';
import importPlugin from 'eslint-plugin-import-x';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import { ConfigWithExtends } from 'typescript-eslint';

export const jsConfig: ConfigWithExtends = {
  extends: [eslint.configs.recommended],
  files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
  ignores: ['**/*.config.js'],
  languageOptions: {
    ecmaVersion: 2024,
    sourceType: 'module',
  },
  plugins: {
    'import-x': importPlugin,
    'simple-import-sort': simpleImportSort,
  },
  settings: {
    'import-x/resolver': { node: true },
  },
  rules: {
    ...importPlugin.configs.recommended.rules,
    'func-names': ['error'],
    'func-style': ['error'],
    'import-x/order': [
      'error',
      {
        alphabetize: { order: 'asc', caseInsensitive: true },
        'newlines-between': 'never',
      },
    ],
    'no-restricted-syntax': [
      'error',
      {
        selector: 'ThisExpression',
        message: 'Do not use this',
      },
      {
        selector:
          "Literal[raw='null']:not(CallExpression[callee.name='useRef'] > Literal[raw='null'])",
        message: 'Do not use null',
      },
      {
        selector: 'ExportDefaultDeclaration',
        message: 'Do not use export default',
      },
      {
        selector: 'ClassDeclaration',
        message: 'Do not use class declarations',
      },
      {
        selector: 'ClassExpression',
        message: 'Do not use class expressions',
      },
      {
        selector:
          'Property[method=true]:not([key.name=/^(constructor|get|set)$/])',
        message: 'Do not use object methods, use arrow functions instead',
      },
      {
        selector: 'TSMethodSignature',
        message:
          'Do not use method signatures in types, use arrow function types instead',
      },
    ],
    'object-shorthand': ['error', 'always'],
    'simple-import-sort/exports': 'error',
  },
};
