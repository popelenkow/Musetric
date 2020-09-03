/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable no-param-reassign */
import i18n, { Resource, ResourceLanguage } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { localeSet, namespaceSet, isLocale, Locale } from 'musetric/locales';

const resources = localeSet.reduce<Resource>((result, locale) => {
	result[locale] = namespaceSet.reduce<ResourceLanguage>((resource, ns) => {
		resource[ns] = require(`../locales/${locale}/${ns}.json`);
		return resource;
	}, {});
	return result;
}, {});

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
