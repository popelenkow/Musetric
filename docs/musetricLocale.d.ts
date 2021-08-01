import { ResourceLanguage } from 'i18next';

export declare type Locale = ResourceLanguage;
export declare type LocaleEntry = {
	localeId: string;
	locale: Locale;
};
export declare const getMusetricLocaleEntries: () => LocaleEntry[];

export {};
