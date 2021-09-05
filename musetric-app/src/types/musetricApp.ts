import { LocaleEntry } from 'musetric/AppBase/Locale';
import { ThemeEntry } from 'musetric/AppBase/Theme';
import { Icons } from 'musetric/AppBase/Icon';

export type CreateMusetricAppOptions = {
	elementId: string;
	allLocaleEntries: LocaleEntry[];
	allThemeEntries: ThemeEntry[];
	icons: Icons;
};
export type CreateMusetricApp = (options: CreateMusetricAppOptions) => Promise<void>;
export declare const createMusetricApp: CreateMusetricApp;
