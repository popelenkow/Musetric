import { config } from '@musetric/eslint-config';
export default [
  ...config('node'),
  {
    ignores: ['**/public/**'],
  },
];
