import i18n, { Resource, ResourceLanguage } from 'i18next';
import { initReactI18next } from "react-i18next";
import { localeSet, namespaceSet, isLocale, Locale } from 'musetric/locales';

const resources = localeSet.reduce<Resource>((resources, locale) => {
    resources[locale] = namespaceSet.reduce<ResourceLanguage>((resource, ns) => {
		resource[ns] = require(`../locales/${locale}/${ns}.json`);
		return resource;
	}, {});
    return resources;
}, {});

export const initLocale = (initLocale?: string | null): Locale => {
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