import { allThemes, getStorageThemeId } from 'musetric/Themes';

const runSplashScreen = () => {
	const themeId = getStorageThemeId();
	const theme = allThemes[themeId];
	const root = document.getElementById('root');
	if (!root) return;
	const splashScreen = document.createElement('div');
	splashScreen.style.height = `${window.innerHeight}px`;
	splashScreen.style.width = '100%';
	splashScreen.style.display = 'flex';
	splashScreen.style.justifyContent = 'center';
	splashScreen.style.alignItems = 'center';
	splashScreen.style.font = '36px/40px "Segoe UI", Arial, sans-serif';
	splashScreen.style.backgroundColor = theme.app;
	splashScreen.style.color = theme.content;
	splashScreen.innerText = 'Musetric';
	root.appendChild(splashScreen);
};
runSplashScreen();
