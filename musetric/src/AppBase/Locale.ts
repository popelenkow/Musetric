import i18next, { i18n as I18n, WithT, ResourceLanguage, Resource } from 'i18next';

export type Locale = ResourceLanguage;
export type LocaleEntry = {
	localeId: string;
	locale: Locale;
};

export const createLocaleResources = (localeEntries: LocaleEntry[]): Resource => (
	localeEntries.reduce<Resource>((acc, x) => ({ ...acc, [x.localeId]: x.locale }), {})
);

export const createI18n = async (
	initLocaleId: string,
	localeEntries: LocaleEntry[],
): Promise<I18n> => {
	const result = i18next.createInstance();
	const resources = createLocaleResources(localeEntries);

	await result.init({
		lng: initLocaleId,
		fallbackLng: initLocaleId,
		defaultNS: 'musetric',
		supportedLngs: localeEntries.map((x) => x.localeId),
		resources,
		debug: false,
	});

	return result;
};

export const getStorageLocaleId = (): string | undefined => {
	const localeId = localStorage.getItem('locale') || undefined;
	return localeId;
};
export const setStorageLocaleId = (localeId: string): void => {
	localStorage.setItem('locale', localeId);
};

export const localizeLocaleId = (lng: string, i18n: WithT): string | undefined => {
	const res = i18n.t('AppBase:locale', { lng });
	return res;
};

export const localizeThemeId = (theme: string, i18n: WithT): string | undefined => {
	if (theme === 'white') return i18n.t('AppBase:theme.white');
	if (theme === 'dark') return i18n.t('AppBase:theme.dark');
	return undefined;
};
