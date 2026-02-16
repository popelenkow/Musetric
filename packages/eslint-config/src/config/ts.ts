import tsEslint, { type ConfigWithExtends } from 'typescript-eslint';
import { jsConfig } from './js.js';

export const tsConfig: ConfigWithExtends = {
  ...jsConfig,
  extends: [...(jsConfig.extends ?? []), ...tsEslint.configs.recommended],
  files: ['**/*.ts'],
  languageOptions: {
    ...jsConfig.languageOptions,
    parserOptions: {
      project: ['./tsconfig.json'],
      tsconfigRootDir: process.cwd(),
    },
  },
  rules: {
    ...jsConfig.rules,
    '@typescript-eslint/consistent-type-assertions': [
      'error',
      { assertionStyle: 'never' },
    ],
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        prefer: 'type-imports',
        fixStyle: 'inline-type-imports',
      },
    ],
    '@typescript-eslint/init-declarations': ['error', 'always'],
    '@typescript-eslint/no-empty-function': ['error'],
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-non-null-assertion': ['error'],
    '@typescript-eslint/no-shadow': ['error'],
    '@typescript-eslint/no-unused-vars': ['error'],
    '@typescript-eslint/no-use-before-define': [
      'error',
      {
        functions: true,
        classes: true,
        variables: true,
        enums: true,
        typedefs: true,
        ignoreTypeReferences: false,
      },
    ],
    '@typescript-eslint/no-useless-constructor': ['error'],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'variable',
        format: ['camelCase', 'PascalCase'],
      },
    ],
    '@typescript-eslint/await-thenable': 'error',
    '@typescript-eslint/promise-function-async': 'error',
    '@typescript-eslint/require-await': 'error',
  },
};
