export type CreateMusetricAppOptions = {
	elementId: string;
	allLocaleEntries: LocaleEntry[];
	allThemeEntries: ThemeEntry[];
	apiUrl: string;
	workers: Workers;
};
export type CreateMusetricApp = (options: CreateMusetricAppOptions) => Promise<void>;
export declare const createMusetricApp: CreateMusetricApp;

export {};
