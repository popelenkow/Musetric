export declare type Theme = {
	app: string;
	sidebar: string;
	content: string;
	disabled: string;
	hover: string;
	active: string;
	splitter: string;
};
export declare type ThemeEntry = {
	themeId: string;
	theme: Theme;
};
export declare const getMusetricThemeEntries: () => ThemeEntry[];

export {};
