const ghPages = require('gh-pages');

ghPages.publish('dist', {
	dotfiles: true,
	history: false,
	message: 'Release Musetric Application'
}, (err) => {
	console.error(err);
});
