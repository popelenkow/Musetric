import i18n from 'i18next';

const lngs = ['en', 'ru'];
const nss = ['game'];

export const initLocale = () => {
	i18n.init({
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
			i18n.addResources(lng, ns, resources);
		})
	})
}