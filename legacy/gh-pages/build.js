const copyfiles = require('copyfiles');

const err = (error) => error && console.error(error);

copyfiles(['node_modules/musetric-app/**/*', 'dist'], 2, err);
copyfiles(['../.gitignore', 'dist'], 1, err);
