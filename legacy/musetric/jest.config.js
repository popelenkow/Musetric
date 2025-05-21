module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    globals: {
        'ts-jest': {
            tsconfig: 'test/tsconfig.json',
        },
    },
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    testMatch: ['**/test/**/*.ts'],
};
