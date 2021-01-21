import { TFunction } from 'i18next';

import white from './white';
import dark from './dark';

export type Theme = typeof white;

const createRecord = <T extends { [name: string]: Theme }>(x: T) => x;
export const allThemes = createRecord({
	white,
	dark,
});

export const localizeThemeId = (theme: string, t: TFunction): string | undefined => {
	if (theme === 'white') return t('Musetric:theme.white');
	if (theme === 'dark') return t('Musetric:theme.dark');
	return undefined;
};

export type ThemeId = keyof typeof allThemes;
export const themeIdList = Object.keys(allThemes) as ThemeId[];
// eslint-disable-next-line max-len
export const isTheme = (value?: string | null): value is ThemeId => themeIdList.findIndex(x => x === value) !== -1;
