export type Theme = {
	background: string,
	backgroundPanel: string,
	content: string,
	contentHover: string,
	contentHoverActive: string,
	primary: string,
	primaryHover: string,
	primaryHoverActive: string,
	divider: string,
	shadow: string,
};
export const themeVariables: Theme = {
	background: '--background',
	backgroundPanel: '--background-panel',
	content: '--content',
	contentHover: '--content-hover',
	contentHoverActive: '--content-hover-active',
	primary: '--primary',
	primaryHover: '--primary-hover',
	primaryHoverActive: '--primary-hover-active',
	divider: '--divider',
	shadow: '--shadow',
};

export type ThemeEntry = {
	themeId: string,
	theme: Theme,
};

export const getStorageThemeId = (): string | undefined => {
	const themeId = localStorage.getItem('theme') || undefined;
	return themeId;
};
export const setStorageThemeId = (themeId: string): void => {
	localStorage.setItem('theme', themeId);
};
