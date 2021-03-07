const copyfiles = require('copyfiles');

const err = (error) => error && console.error(error);

copyfiles(['package.json', 'dist'], err);
copyfiles(['licence.txt', 'dist'], err);
copyfiles(['readme.md', 'dist'], err);
copyfiles(['favicon.ico', 'dist'], err);
