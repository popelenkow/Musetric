import eslint from '@eslint/js';
import { defaultConditionNames } from 'eslint-import-resolver-typescript';
import importPlugin from 'eslint-plugin-import-x';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import { type ConfigWithExtends } from 'typescript-eslint';

export const importResolverConditionNames =
  defaultConditionNames.concat('monorepo');

export const jsConfig: ConfigWithExtends = {
  extends: [eslint.configs.recommended],
  files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
  ignores: ['**/.venv/**/*', '**/dist/**/*'],
  languageOptions: {
    ecmaVersion: 2024,
    sourceType: 'module',
  },
  plugins: {
    'import-x': importPlugin,
    'simple-import-sort': simpleImportSort,
  },
  settings: {
    'import-x/resolver': {
      node: {
        conditionNames: importResolverConditionNames,
      },
    },
  },
  rules: {
    ...importPlugin.configs.recommended.rules,
    'func-names': ['error'],
    'func-style': ['error'],
    'import-x/no-default-export': 'error',
    'import-x/no-unresolved': [
      'error',
      {
        ignore: ['\\.wgsl\\?raw$'],
      },
    ],
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
        selector:
          'VariableDeclarator > Identifier.id[name=/^[A-Z]+(?:_[A-Z0-9]+)*$/]',
        message: 'Do not declare variables in SCREAMING_SNAKE_CASE',
      },
      {
        selector:
          "Property[key.type='Identifier'][key.name=/^[A-Z]+(?:_[A-Z0-9]+)*$/]",
        message: 'Do not use SCREAMING_SNAKE_CASE for object property names',
      },
      {
        selector:
          'TSPropertySignature > Identifier[name=/^[A-Z]+(?:_[A-Z0-9]+)*$/]',
        message: 'Do not use SCREAMING_SNAKE_CASE for property signatures',
      },
      {
        selector: 'TSMethodSignature',
        message:
          'Do not use method signatures in types, use arrow function types instead',
      },
      {
        selector: 'SwitchStatement',
        message: 'Do not use switch statements',
      },
      {
        selector:
          ':matches(FunctionDeclaration, FunctionExpression, ArrowFunctionExpression, TSDeclareFunction) > :matches(ObjectPattern, ArrayPattern)',
        message:
          'Do not destructure function parameters inline; destructure inside the function body instead',
      },
      {
        selector:
          ':matches(CallExpression[callee.type="FunctionExpression"], CallExpression[callee.type="ArrowFunctionExpression"])',
        message:
          'Do not invoke inline functions immediately; define the function separately instead',
      },
      {
        selector: 'ExportNamedDeclaration[specifiers.length>0]:not([source])',
        message:
          'Inline export values and types at their declaration instead of exporting separately.',
      },
      {
        selector:
          "CallExpression[callee.name='t']:not([arguments.0.type='Literal'][arguments.0.value=/^[\\s\\S]*$/])",
        message: 'Call t with a single string literal key',
      },
    ],
    'no-restricted-globals': [
      'error',
      {
        name: '__dirname',
        message:
          'Use import.meta.url with fileURLToPath() instead of __dirname in ES modules',
      },
      {
        name: '__filename',
        message: 'Use import.meta.url instead of __filename in ES modules',
      },
      {
        name: 'require',
        message: 'Use import statements instead of require() in ES modules',
      },
      {
        name: 'exports',
        message: 'Use export statements instead of exports in ES modules',
      },
      {
        name: 'module',
        message:
          'Use export statements instead of module.exports in ES modules',
      },
    ],
    'object-shorthand': ['error', 'always'],
    'simple-import-sort/exports': 'error',
    'no-nested-ternary': 'error',
  },
};
