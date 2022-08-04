export type Theme = {
	background: string,
	activeBackground: string,
	content: string,
	activeContent: string,
	hover: string,
	primaryHover: string,
	primary: string,
	activePrimary: string,
	divider: string,
	shadow: string,
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
