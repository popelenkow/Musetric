module.exports = {
  plugins: [
    'musetric',
  ],
  extends: [
    'plugin:musetric/recommended',
  ],
  rules: {
    'import/no-extraneous-dependencies': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    'react/jsx-max-props-per-line': ['error', { maximum: 1 }],
    'react/react-in-jsx-scope': 0,
  },
  ignorePatterns: '**/dist/**',
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
};
