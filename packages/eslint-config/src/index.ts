import globals from 'globals';
import tsEslint, { type ConfigWithExtends } from 'typescript-eslint';
import { jsConfig } from './config/js.js';
import { reactConfig } from './config/react.js';
import { tsConfig } from './config/ts.js';

export type ConfigType = 'browser' | 'node' | 'react';

export const config = (type: ConfigType) => {
  const configs: ConfigWithExtends[] = [
    {
      ignores: jsConfig.ignores,
    },
    jsConfig,
    type === 'react' ? reactConfig : tsConfig,
    {
      files: ['./*.config.{js,ts}'],
      rules: {
        'import-x/no-default-export': 'off',
      },
    },
    {
      languageOptions: {
        globals: type === 'node' ? globals.node : globals.browser,
      },
    },
    {
      files: ['scripts/**/*', './*.config.{js,ts}'],
      languageOptions: {
        globals: globals.node,
      },
    },
  ];

  return tsEslint.config(...configs);
};
