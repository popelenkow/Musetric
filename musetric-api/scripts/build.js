const copyfiles = require('copyfiles');

const err = (error) => error && console.error(error);

copyfiles(['package.json', 'dist'], err);
copyfiles(['src/**/*.json', 'dist'], 1, err);
