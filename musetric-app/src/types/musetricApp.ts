import { LocaleEntry } from 'musetric/AppBase/Locale';
import { ThemeEntry } from 'musetric/AppBase/Theme';
import { Icons } from 'musetric/AppBase/Icon';
import { Workers } from 'musetric/AppBase/Worker';

export type CreateMusetricAppOptions = {
	elementId: string;
	allLocaleEntries: LocaleEntry[];
	allThemeEntries: ThemeEntry[];
	icons: Icons;
	workers: Workers;
};
export type CreateMusetricApp = (options: CreateMusetricAppOptions) => Promise<void>;
export declare const createMusetricApp: CreateMusetricApp;
