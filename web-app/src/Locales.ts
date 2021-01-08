import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Types, Locales } from 'musetric';

export const initLocales = (_locale?: string | null): Types.Locale => {
	const locale = Types.isLocale(_locale) ? _locale : 'en';
	const { resources } = Locales;

	// eslint-disable-next-line @typescript-eslint/no-floating-promises
	i18n
		.use(initReactI18next)
		.init({
			lng: locale,
			fallbackLng: locale,
			defaultNS: 'musetric',
			supportedLngs: Types.localeSet,
			resources,
			debug: false,
		});
	return locale;
};