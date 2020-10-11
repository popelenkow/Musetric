import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { resources, localeSet, isLocale, Locale } from 'musetric/locales';

export const initLocale = (_locale?: string | null): Locale => {
	const locale = isLocale(_locale) ? _locale : 'en';
	i18n
		.use(initReactI18next)
		.init({
			lng: locale,
			fallbackLng: locale,
			defaultNS: 'musetric',
			supportedLngs: localeSet,
			resources,
			debug: false,
		});
	return locale;
};
