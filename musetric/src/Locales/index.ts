import { TFunction } from 'i18next';
import { Types } from '..';

export * from './Entry';

export const localizeLocale = (lng: Types.Locale, t: TFunction): string | undefined => {
	const res = t('Musetric:locale', { lng });
	return res;
};

export const localizeTheme = (theme: string, t: TFunction): string | undefined => {
	if (theme === 'white') return t('Musetric:theme.white');
	if (theme === 'dark') return t('Musetric:theme.dark');
	return undefined;
};
