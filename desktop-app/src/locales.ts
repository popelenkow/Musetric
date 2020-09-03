/* eslint-disable no-param-reassign */
import i18n, { Resource, ResourceLanguage } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { namespaceSet, isLocale, Locale } from 'musetric/locales';
import fs from 'fs';

export const localeSet: Locale[] = fs.readdirSync('./locale') as Locale[];

const resources = localeSet.reduce<Resource>((result, locale) => {
	result[locale] = namespaceSet.reduce<ResourceLanguage>((resource, ns) => {
		const file = fs.readFileSync(`./locale/${locale}/${ns}.json`, 'utf8');
		resource[ns] = JSON.parse(file);
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
