import { i18n, TFunction, Resource } from "i18next";
import { initReactI18next } from "react-i18next";

export type Locale = 'en' | 'ru';
export const localeSet: Locale[] = ['en', 'ru']
export const isLocale = (value: any): value is Locale => localeSet.indexOf(value) !== -1;

export type Namespace = 'Musetric' | 'GameOfLife';
export const namespaceSet: Namespace[] = ['Musetric', 'GameOfLife'];
export const isNamespace = (value: any): value is Locale => localeSet.indexOf(value) !== -1;

export const initLocale = (i18n: i18n, initLocale?: string | null, resources?: Resource): Locale => {
	const locale = isLocale(initLocale) ? initLocale : 'en'; 
	i18n
		.use(initReactI18next)
		.init({
			lng: locale,
			fallbackLng: locale,
			defaultNS: 'musetric',
			supportedLngs: localeSet,
			resources,
			debug: false
		});
	return locale;
}

export const localizeLng = (lng: string, t: TFunction): string | undefined => {
	return t('Musetric:locale', { lng });
}
export const localizeTheme = (theme: string, t: TFunction): string | undefined => {
	if (theme == 'white') return t('Musetric:theme.white')
	if (theme == 'dark') return t('Musetric:theme.dark')
	return;
}