import tsEslint, { type ConfigWithExtends } from 'typescript-eslint';
import { jsConfig } from './config/js.js';
import { getTsConfigs } from './tsConfigs.js';

export type { ConfigType } from './tsConfigs.js';

export const config = () => {
  const cwd = process.cwd();

  const configs: ConfigWithExtends[] = [
    {
      ignores: jsConfig.ignores,
    },
    jsConfig,
    ...getTsConfigs(cwd),
  ];

  return tsEslint.config(...configs);
};
