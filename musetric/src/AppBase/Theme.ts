export type Theme = {
	app: string;
	sidebar: string;
	content: string;
	disabled: string;
	hover: string;
	primary: string;
	divider: string;
	shadow: string;
};
export type ThemeEntry = {
	themeId: string;
	theme: Theme;
};

export const getStorageThemeId = (): string | undefined => {
	const themeId = localStorage.getItem('theme') || undefined;
	return themeId;
};
export const setStorageThemeId = (themeId: string): void => {
	localStorage.setItem('theme', themeId);
};
