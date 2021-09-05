import { ResourceLanguage } from 'i18next';
import { FC } from 'react';

export declare type Locale = ResourceLanguage;
export declare type LocaleEntry = {
	localeId: string;
	locale: Locale;
};
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
export declare type Icons = {
	AppIcon: FC;
	CloseIcon: FC;
	FrequencyIcon: FC;
	GithubIcon: FC;
	InfoIcon: FC;
	LiveIcon: FC;
	MenuIcon: FC;
	OpenFileIcon: FC;
	PerformanceIcon: FC;
	PlayIcon: FC;
	RecordIcon: FC;
	SaveIcon: FC;
	SpectrogramIcon: FC;
	StopIcon: FC;
	WaveformIcon: FC;
};
export declare type CreateMusetricAppOptions = {
	elementId: string;
	allLocaleEntries: LocaleEntry[];
	allThemeEntries: ThemeEntry[];
	icons: Icons;
};
export declare type CreateMusetricApp = (options: CreateMusetricAppOptions) => Promise<void>;
export declare const createMusetricApp: CreateMusetricApp;

export {};
