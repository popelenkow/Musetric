import i18next, { i18n as I18nOriginal, ResourceLanguage, Resource, TOptionsBase } from 'i18next';

export type LocaleResource = ResourceLanguage;
export type LocaleEntry = {
	localeId: string,
	localeResource: LocaleResource,
};

export const createLocaleResources = (localeEntries: LocaleEntry[]): Resource => (
	localeEntries.reduce<Resource>((acc, x) => ({ ...acc, [x.localeId]: x.localeResource }), {})
);

export type I18n = Omit<I18nOriginal, 't'> & {
	t: (key: string, options?: TOptionsBase & Record<string, string>) => string,
};
export const createI18n = async (
	initLocaleId: string,
	localeEntries: LocaleEntry[],
): Promise<I18n> => {
	const result = i18next.createInstance();
	const resources = createLocaleResources(localeEntries);

	await result.init({
		lng: initLocaleId,
		fallbackLng: initLocaleId,
		supportedLngs: localeEntries.map((x) => x.localeId),
		resources,
		debug: false,
	});

	return {
		...result,
		// eslint-disable-next-line
		t: (...args: any) => result.t.apply(result, args) ?? '',
	};
};

export const getStorageLocaleId = (): string | undefined => {
	const localeId = localStorage.getItem('locale') ?? undefined;
	return localeId;
};
export const setStorageLocaleId = (localeId: string): void => {
	localStorage.setItem('locale', localeId);
};

export const localizeLocaleId = (lng: string, i18n: I18n): string | undefined => {
	const res = i18n.t('AppBase:locale', { lng });
	return res;
};

export const localizeThemeId = (theme: string, i18n: I18n): string | undefined => {
	if (theme === 'light') return i18n.t('AppBase:theme.light');
	if (theme === 'dark') return i18n.t('AppBase:theme.dark');
	return undefined;
};
