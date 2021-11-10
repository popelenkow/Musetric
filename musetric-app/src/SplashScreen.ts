import { getStorageThemeId, ThemeEntry } from 'musetric/AppBase/Theme';

declare const getMusetricThemeEntries: () => ThemeEntry[];

const runSplashScreen = () => {
	const themeId = getStorageThemeId() || 'dark';
	const allThemeEntries = getMusetricThemeEntries();
	const { theme } = allThemeEntries.find((x) => x.themeId === themeId) || {};
	if (!theme) return;
	const root = document.getElementById('root');
	if (!root) return;
	const splashScreen = document.createElement('div');
	splashScreen.style.height = `${window.innerHeight}px`;
	splashScreen.style.width = '100%';
	splashScreen.style.display = 'flex';
	splashScreen.style.justifyContent = 'center';
	splashScreen.style.alignItems = 'center';
	splashScreen.style.font = '36px/40px "Segoe UI", Arial, sans-serif';
	splashScreen.style.backgroundColor = theme.background;
	splashScreen.style.color = theme.activeContent;
	splashScreen.innerText = 'Musetric';
	root.appendChild(splashScreen);
};
runSplashScreen();
