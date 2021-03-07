import { TFunction } from 'i18next';

import white from './white';
import dark from './dark';

export type ColorTheme = typeof white;

const createRecord = <T extends { [name: string]: ColorTheme }>(x: T) => x;
export const allColorThemes = createRecord({
	white,
	dark,
});

export const localizeColorThemeId = (theme: string, t: TFunction): string | undefined => {
	if (theme === 'white') return t('Musetric:theme.white');
	if (theme === 'dark') return t('Musetric:theme.dark');
	return undefined;
};

export type ColorThemeId = keyof typeof allColorThemes;
export const allColorThemeIds = Object.keys(allColorThemes) as ColorThemeId[];
// eslint-disable-next-line max-len
export const isColorTheme = (value?: string | null): value is ColorThemeId => allColorThemeIds.findIndex(x => x === value) !== -1;
