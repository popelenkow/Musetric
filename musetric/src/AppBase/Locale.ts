import i18n, { i18n as I18n, TFunction, ResourceLanguage, Resource } from 'i18next';

export type Locale = ResourceLanguage;
export type LocaleEntry = {
	localeId: string;
	locale: Locale;
};

export const createLocaleResources = (localeEntries: LocaleEntry[]) => (
	localeEntries.reduce<Resource>((acc, x) => ({ ...acc, [x.localeId]: x.locale }), {})
);

export const createI18n = async (
	initLocaleId: string,
	localeEntries: LocaleEntry[],
): Promise<I18n> => {
	const result = i18n.createInstance();
	const resources = createLocaleResources(localeEntries);

	await result.init({
		lng: initLocaleId,
		fallbackLng: initLocaleId,
		defaultNS: 'musetric',
		supportedLngs: localeEntries.map(x => x.localeId),
		resources,
		debug: false,
	});

	return result;
};

export const getStorageLocaleId = (): string | undefined => {
	const localeId = localStorage.getItem('locale') || undefined;
	return localeId;
};
export const setStorageLocaleId = (localeId: string) => {
	localStorage.setItem('locale', localeId);
};

export const localizeLocaleId = (lng: string, t: TFunction): string | undefined => {
	const res = t('Musetric:locale', { lng });
	return res;
};

export const localizeThemeId = (theme: string, t: TFunction): string | undefined => {
	if (theme === 'white') return t('Musetric:theme.white');
	if (theme === 'dark') return t('Musetric:theme.dark');
	return undefined;
};
