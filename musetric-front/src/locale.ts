import i18n from 'i18next';
import { initReactI18next } from "react-i18next";
import { localeSet } from './types';

const nss = ['musetric', 'game'];

type OriginalLocaleSet = { [locale: string]: string };
export const originalLocaleSet: OriginalLocaleSet = require('./locale/locale.json')

export const initLocale = () => {
	const resources: any = {};
	localeSet.forEach(lng => {
		resources[lng] = {};
		nss.forEach(ns => {
			const bundle = require(`./locale/${lng}/${ns}.json`)
			resources[lng][ns] = bundle;
		})
	})

	i18n
		.use(initReactI18next)
		.init({
			lng: 'en',
			fallbackLng: 'en',
			defaultNS: 'musetric',
			supportedLngs: localeSet,
			resources: resources,
			debug: false
		})
}