/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
export type Locale = 'en' | 'ru';
export const localeSet: Locale[] = ['en', 'ru'];
export const isLocale = (value: any): value is Locale => localeSet.indexOf(value) !== -1;

export type Theme = 'white' | 'dark';
export const themeSet: Theme[] = ['white', 'dark'];
export const isTheme = (value: any): value is Theme => themeSet.indexOf(value) !== -1;

export type ContentId = 'recorder' | 'gameOfLife';
export const contentSet: ContentId[] = ['recorder', 'gameOfLife'];
export const isContentId = (value: any): value is ContentId => contentSet.indexOf(value) !== -1;
