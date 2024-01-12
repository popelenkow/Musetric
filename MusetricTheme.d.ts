export type CreateMusetricAppOptions = {
	elementId: string;
	allLocaleEntries: LocaleEntry[];
	allThemeEntries: ThemeEntry[];
	apiUrl: string;
	workers: Workers;
};
export declare const getMusetricThemeEntries: () => CreateMusetricAppOptions["allThemeEntries"];

export {};
