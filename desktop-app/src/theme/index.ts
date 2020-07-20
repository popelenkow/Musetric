export type Theme = 'white' | 'dark'
export const themeSet: Theme[] = ['white', 'dark']
export const isTheme = (value: any): value is Theme => themeSet.indexOf(value) !== -1;