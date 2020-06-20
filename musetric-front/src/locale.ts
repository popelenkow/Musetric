import i18n from 'i18next';

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
	
	const localeData: Array<{ ns: string, lng: string, resources: any }> = require('./locale/en-locale.json')
	localeData.forEach(({ ns, lng, resources }) => i18n.addResources(lng, ns, resources));
}