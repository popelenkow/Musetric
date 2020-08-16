import i18n from 'i18next';
import fs from 'fs'
import { initReactI18next } from "react-i18next";

export type Locale = 'en' | 'ru'
export const localeSet: Locale[] = fs.readdirSync('./locale') as Locale[];
export const isLocale = (value: any): value is Locale => localeSet.indexOf(value) !== -1;
export const namespaceSet: string[] = fs.readdirSync('./locale/en').map(x => x.replace('.json', ''));
export const naturalLocale = (key: string): string | undefined => {
	return i18n.t('Musetric:locale', { lng: key });
}

export const initLocale = (initLocale?: string | null): Locale => {
	const resources: any = {};
	localeSet.forEach(locale => {
		resources[locale] = {};
		namespaceSet.forEach(ns => {
			const bundle = JSON.parse(fs.readFileSync(`./locale/${locale}/${ns}.json`, 'utf8'))
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