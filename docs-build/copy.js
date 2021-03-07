const copyfiles = require('copyfiles');

const err = (error) => error && console.error(error);

copyfiles(['node_modules/musetric-app/**/*', '../docs'], 2, err);
