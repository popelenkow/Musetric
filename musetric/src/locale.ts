import i18n, { TFunction } from "i18next";

export const localizeLng = (lng: string): string | undefined => {
	return i18n.t('Musetric:locale', { lng });
}

export const localizeTheme = (theme: string, t: TFunction) => {
	if (theme == 'white') return t('Musetric:theme.white')
	if (theme == 'dark') return t('Musetric:theme.dark')
	return;
}