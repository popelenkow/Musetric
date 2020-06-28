import i18n from 'i18next';
import { initReactI18next } from "react-i18next";
import { localeSet } from './types';

const nss = ['musetric', 'game'];

type OriginalLocaleSet = { [locale: string]: string };
export const originalLocaleSet: OriginalLocaleSet = require('./locale/locale.json')

export const initLocale = () => {
	i18n
		.use(initReactI18next)
		.init({
			fallbackLng: 'en',
			defaultNS: 'musetric',
			debug: false,
			detection: {
				order: ['querystring', 'navigator'],
				lookupQuerystring: 'lng',
			},
			appendNamespaceToMissingKey: true,
		})

	localeSet.forEach(lng => {
		nss.forEach(ns => {
			const resources = require(`./locale/${lng}/${ns}.json`)
			i18n.addResourceBundle(lng, ns, resources);
		})
	})
}