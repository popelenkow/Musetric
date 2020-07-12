import i18n from 'i18next';
import { initReactI18next } from "react-i18next";
import { localeSet, isLocale, Locale } from './types';

export const naturalLocale = (key: string): string | undefined => {
	const locales = require('../locale/natural-locale.json')
	return locales[key];
}

const nss = ['musetric', 'game'];
export const initLocale = (initLocale?: string | null): Locale => {
	const resources: any = {};
	localeSet.forEach(locale => {
		resources[locale] = {};
		nss.forEach(ns => {
			const bundle = require(`../locale/${locale}/${ns}.json`)
			resources[locale][ns] = bundle;
		})
	})

	const locale = isLocale(initLocale) ? initLocale : 'en'; 
	i18n
		.use(initReactI18next)
		.init({
			lng: locale,
			fallbackLng: locale,
			defaultNS: 'musetric',
			supportedLngs: localeSet,
			resources: resources,
			debug: false
		})
	
	return locale;
}