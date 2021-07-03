const start = () => {
	const root = document.getElementById('root');
	if (!root) return;
	const image = document.createElement('div');
	root.appendChild(image);
	image.style.height = `${window.innerHeight}px`;
	image.style.width = '100%';
	image.style.display = 'flex';
	image.style.justifyContent = 'center';
	image.style.alignItems = 'center';
	image.style.font = '36px/40px "Segoe UI", Arial, sans-serif';
	image.innerText = 'Musetric';
};
start();
