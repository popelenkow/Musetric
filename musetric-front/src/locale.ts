import i18next from 'i18next';

const lngs = ['en', 'ru'];
const nss = ['musetric', 'game'];

export const initLocale = () => {
	i18next.init({
		fallbackLng: 'en',
		defaultNS: 'musetric',
		debug: false,
		detection: {
			order: ['querystring', 'navigator'],
			lookupQuerystring: 'lng',
		},
		appendNamespaceToMissingKey: true,
	});

	lngs.forEach(lng => {
		nss.forEach(ns => {
			const resources = require(`./locale/${lng}/${ns}.json`)
			i18next.addResourceBundle(lng, ns, resources);
		})
	})
}