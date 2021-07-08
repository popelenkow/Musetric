const copyfiles = require('copyfiles');

const err = (error) => error && console.error(error);

copyfiles(['package.json', 'dist'], err);
copyfiles(['licence.txt', 'dist'], err);
copyfiles(['src/types/musetricApp.d.ts', 'dist'], 2, err);
copyfiles(['readme.md', 'dist'], err);
