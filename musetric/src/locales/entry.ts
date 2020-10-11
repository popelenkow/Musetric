import { Resource } from 'i18next';

import en from './en';
import ru from './ru';

export const resources: Resource = {
	en,
	ru,
};

export type Locale =
	| 'en'
	| 'ru';
export const localeSet: Locale[] = [
	'en',
	'ru',
];
export const isLocale = (value: any): value is Locale => localeSet.indexOf(value) !== -1;
