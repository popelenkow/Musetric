export type Theme = 'white' | 'dark'
export const themeSet: Theme[] = ['white', 'dark']
export const isTheme = (value: any): value is Theme => themeSet.indexOf(value) !== -1;

export type Locale = 'en' | 'ru'
export const localeSet: Locale[] = ['en', 'ru']
export const isLocale = (value: any): value is Locale => localeSet.indexOf(value) !== -1;