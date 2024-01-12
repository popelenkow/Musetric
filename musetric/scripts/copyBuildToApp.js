const fs = require('fs');

const copyBuildToApp = (src, dist) => {
	if (fs.existsSync(dist)) {
		fs.rmSync(dist, { recursive: true, force: true });
	}
	fs.cpSync(src, dist, { recursive: true });
};

copyBuildToApp('dist', '../musetric-app/node_modules/musetric');
