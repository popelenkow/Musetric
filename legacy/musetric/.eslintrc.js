// eslint-disable-next-line import/no-extraneous-dependencies
const { getTsPath } = require('eslint-plugin-musetric/utils');

const extensions = ['js', 'ts', 'jsx', 'tsx'];

module.exports = {
    plugins: [
        'musetric',
    ],
    extends: [
        'plugin:musetric/recommended',
    ],
    rules: {
        'react-hooks/exhaustive-deps': ['error', {
            additionalHooks: '(useLazyMemo)',
        }],
    },
    ignorePatterns: extensions.map((ext) => `**/dist/**/*.${ext}`),
    overrides: [
        getTsPath(__dirname, '.'),
        {
            ...getTsPath(__dirname, 'scripts'),
            rules: {
                'no-console': 0,
                'import/no-extraneous-dependencies': 0,
            },
        },
        {
            ...getTsPath(__dirname, 'test'),
            rules: {
                'max-len': 0,
                '@typescript-eslint/no-loop-func': 0,
                '@typescript-eslint/no-namespace': 0,
                '@typescript-eslint/consistent-type-definitions': 0,
            },
        },
        {
            ...getTsPath(__dirname, 'performance'),
            rules: {
                '@typescript-eslint/no-unused-expressions': 0,
                '@typescript-eslint/no-explicit-any': 0,
                '@typescript-eslint/no-unsafe-assignment': 0,
                '@typescript-eslint/no-unsafe-member-access': 0,
                'import/no-extraneous-dependencies': 0,
            },
        },
    ],
};
