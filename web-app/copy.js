const copyfiles = require('copyfiles');

const err = (error) => error && console.error(error);

copyfiles(['favicon.ico', 'dist'], err);
