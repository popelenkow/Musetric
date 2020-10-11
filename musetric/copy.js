const cpx = require('cpx');

cpx.copySync('package.json', 'dist');
cpx.copySync('licence.txt', 'dist');
cpx.copySync('readme.md', 'dist');
cpx.copySync('src/**/*.*css', 'dist');
cpx.copySync('src/**/*.json', 'dist');
