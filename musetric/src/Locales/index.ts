import i18n, { i18n as I18n, TFunction, Resource } from 'i18next';

import en from './en';
import ru from './ru';

export type Locale = typeof en;

const createRecord = <T extends { [name: string]: Locale }>(x: T) => x;
const allLocales = createRecord({
	en,
	ru,
});

export type LocaleId = keyof typeof allLocales;
export const localeIdList = Object.keys(allLocales) as LocaleId[];
// eslint-disable-next-line max-len
export const isLocaleId = (value?: string | null): value is LocaleId => localeIdList.findIndex(x => x === value) !== -1;

export const getStorageLocaleId = () => {
	const themeId = localStorage.getItem('locale');
	if (isLocaleId(themeId)) return themeId;
	return 'en';
};
export const setStorageLocaleId = (themeId: string) => {
	localStorage.setItem('locale', themeId);
};

export const localizeLocaleId = (lng: string, t: TFunction): string | undefined => {
	const res = t('Musetric:locale', { lng });
	return res;
};

export const resources: Resource = allLocales;

export const createI18n = async (initLocaleId?: string | null): Promise<I18n> => {
	const result = i18n.createInstance();

	const locale = isLocaleId(initLocaleId) ? initLocaleId : localeIdList[0];

	await result
		.init({
			lng: locale,
			fallbackLng: locale,
			defaultNS: 'musetric',
			supportedLngs: localeIdList,
			resources,
			debug: false,
		});

	return result;
};
