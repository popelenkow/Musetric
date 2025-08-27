import tsEslint, { ConfigWithExtends } from 'typescript-eslint';
import { jsConfig } from './js';

export const tsConfig: ConfigWithExtends = {
  ...jsConfig,
  extends: [...(jsConfig.extends ?? []), ...tsEslint.configs.recommended],
  files: ['**/*.ts'],
  ignores: ['**/*.config.ts'],
  languageOptions: {
    ...jsConfig.languageOptions,
    parserOptions: {
      project: true,
      tsconfigRootDir: process.cwd(),
    },
  },
  settings: {
    ...jsConfig.settings,
    'import-x/resolver': { typescript: true },
  },
  rules: {
    ...jsConfig.rules,
    '@typescript-eslint/consistent-type-assertions': [
      'error',
      { assertionStyle: 'never' },
    ],
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    '@typescript-eslint/init-declarations': ['error', 'always'],
    '@typescript-eslint/no-empty-function': ['error'],
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-non-null-assertion': ['error'],
    '@typescript-eslint/no-shadow': ['error'],
    '@typescript-eslint/no-unused-vars': ['error'],
    '@typescript-eslint/no-use-before-define': ['error'],
    '@typescript-eslint/no-useless-constructor': ['error'],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'variable',
        format: ['camelCase', 'PascalCase'],
      },
    ],
    '@typescript-eslint/promise-function-async': 'error',
    '@typescript-eslint/require-await': 'error',
  },
};
