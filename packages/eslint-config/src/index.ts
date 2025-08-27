import globals from 'globals';
import tsEslint, { ConfigWithExtends } from 'typescript-eslint';
import { jsConfig } from './config/js';
import { reactConfig } from './config/react';
import { tsConfig } from './config/ts';

export type ConfigType = 'browser' | 'node' | 'react';

export const config = (type: ConfigType) => {
  const configs: ConfigWithExtends[] = [
    jsConfig,
    type === 'react' ? reactConfig : tsConfig,
    {
      languageOptions: {
        globals: type === 'node' ? globals.node : globals.browser,
      },
    },
    {
      files: ['scripts/**/*'],
      languageOptions: {
        globals: globals.node,
      },
    },
  ];

  return tsEslint.config(...configs);
};
