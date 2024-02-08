const path = require('path');

const extensions = ['js', 'ts', 'jsx', 'tsx'];
const getTsPath = (root, directory) => {
    return {
        files: extensions.map((ext) => `${directory}/**/*.${ext}`),
        parserOptions: {
            tsconfigRootDir: path.join(root, directory),
        },
    };
};

module.exports = { getTsPath };
