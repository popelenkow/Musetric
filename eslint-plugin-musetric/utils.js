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
const getTsPaths = (root, directories) => {
    return directories.map((directory) => getTsPath(root, directory));
};
const getIgnorePatterns = (directories, patterns) => {
    return [
        ...patterns,
        ...directories.map((dir) => extensions.map((ext) => `**/${dir}/**/*.${ext}`)).flat(),
    ];
};

module.exports = { extensions, getTsPath, getTsPaths, getIgnorePatterns };
