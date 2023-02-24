export type Theme = {
	background: string,
	activeBackground: string,
	content: string,
	contentHover: string,
	primary: string,
	primaryHover: string,
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
