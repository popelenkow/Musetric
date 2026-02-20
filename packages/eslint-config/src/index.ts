import type { Linter } from 'eslint';
import { jsConfig } from './config/js.js';
import { getTsConfigs } from './tsConfigs.js';

export const config = () => {
  const cwd = process.cwd();

  const configs: Linter.Config[] = [
    {
      ignores: jsConfig.ignores,
    },
    jsConfig,
    ...getTsConfigs(cwd),
    {
      files: ['**/*.config.ts'],
      rules: {
        'no-restricted-exports': 'off',
      },
    },
  ];

  return configs;
};
