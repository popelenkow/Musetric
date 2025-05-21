const extensions = ['js', 'ts', 'jsx', 'tsx'];

module.exports = {
  env: { browser: true, es2020: true },
  plugins: [
    'musetric',
  ],
  extends: [
    'plugin:musetric/recommended',
  ],
  rules: {
    'import/no-extraneous-dependencies': 0,
    '@typescript-eslint/no-unsafe-member-access': 0,
    '@typescript-eslint/no-unsafe-call': 0,
    '@typescript-eslint/no-unsafe-assignment': 0,
    '@typescript-eslint/no-unsafe-return': 0,
    'import/no-absolute-path': 'error',
  },
  ignorePatterns: extensions.map((ext) => `**/dist/**/*.${ext}`),
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
};
