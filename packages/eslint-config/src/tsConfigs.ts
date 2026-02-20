import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Linter } from 'eslint';
import globals from 'globals';
import { reactConfig } from './config/react.js';
import { tsConfig } from './config/ts.js';

export type ConfigType = 'browser' | 'node' | 'react';

type TsConfigItem = {
  path: string;
  type: ConfigType;
  files: string[];
  ignores: string[];
};

const tsConfigItems: TsConfigItem[] = [
  {
    path: './tsconfig.react.json',
    type: 'react',
    files: ['src/**/*.{ts,tsx}'],
    ignores: [
      'src/**/*.worker.ts',
      'src/**/*.worklet.ts',
      'src/**/*.shared.ts',
    ],
  },
  {
    path: './tsconfig.dom.json',
    type: 'browser',
    files: ['src/**/*.ts'],
    ignores: [
      'src/**/*.worker.ts',
      'src/**/*.worklet.ts',
      'src/**/*.shared.ts',
    ],
  },
  {
    path: './tsconfig.node.json',
    type: 'node',
    files: ['src/**/*.ts'],
    ignores: [],
  },
  {
    path: './tsconfig.worker.json',
    type: 'browser',
    files: ['src/**/*.worker.ts'],
    ignores: [],
  },
  {
    path: './tsconfig.worklet.json',
    type: 'browser',
    files: ['src/**/*.worklet.ts'],
    ignores: [],
  },
  {
    path: './tsconfig.shared.json',
    type: 'browser',
    files: ['src/**/*.shared.ts'],
    ignores: [],
  },
  {
    path: './tsconfig.script.json',
    type: 'node',
    files: ['**/*.ts'],
    ignores: ['src/**/*', 'dist/**/*', 'storage/**/*'],
  },
];

const createTsConfig = (item: TsConfigItem, cwd: string): Linter.Config => {
  const base = item.type === 'react' ? reactConfig : tsConfig;

  return {
    ...base,
    files: item.files,
    ignores: item.ignores,
    languageOptions: {
      ...base.languageOptions,
      globals: item.type === 'node' ? globals.node : globals.browser,
      parserOptions: {
        ...base.languageOptions?.parserOptions,
        project: [item.path],
        tsconfigRootDir: cwd,
      },
    },
  };
};

export const getTsConfigs = (cwd: string): Linter.Config[] =>
  tsConfigItems
    .filter((item) => existsSync(resolve(cwd, item.path)))
    .map((item) => createTsConfig(item, cwd));
