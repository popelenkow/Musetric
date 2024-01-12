const fs = require('fs');
const path = require('path');

const createDist = (dirPath) => {
    if (fs.existsSync(dirPath)) {
        fs.rmSync(dirPath, { recursive: true, force: true });
    }
    fs.mkdirSync(dirPath);
};
const distDirPath = path.resolve(__dirname, '../dist');
createDist(distDirPath);

const copyFileToDist = (dirPath, fileName) => {
    fs.copyFileSync(path.resolve(__dirname, dirPath, fileName), path.resolve(distDirPath, fileName));
};
copyFileToDist('..', 'package.json');
copyFileToDist('../..', 'license.md');
copyFileToDist('..', 'readme.md');
copyFileToDist('..', 'utils.js');
copyFileToDist('..', 'tsconfig.base.json');
