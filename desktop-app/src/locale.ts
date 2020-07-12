import i18n from 'i18next';
import { initReactI18next } from "react-i18next";
import { localeSet, isLocale, Locale } from './types';

export const naturalLocale = (key: string): string | undefined => {
	const locales = require('../locale/natural-locale.json')
	return locales[key];
}

const nss = ['musetric', 'game'];
export const initLocale = (initLng?: string | null): Locale => {
	const resources: any = {};
	localeSet.forEach(lng => {
		resources[lng] = {};
		nss.forEach(ns => {
			const bundle = require(`../locale/${lng}/${ns}.json`)
			resources[lng][ns] = bundle;
		})
	})

	const lng = isLocale(initLng) ? initLng : 'en'; 
	i18n
		.use(initReactI18next)
		.init({
			lng,
			fallbackLng: 'en',
			defaultNS: 'musetric',
			supportedLngs: localeSet,
			resources: resources,
			debug: false
		})
	
	return lng;
}