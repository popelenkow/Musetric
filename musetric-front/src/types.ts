export type Theme =  'white' | 'dark'
export const themeSet: Theme[] = ['white', 'dark']
export const isTheme = (value: any): value is Theme => {
    return themeSet.indexOf(value) !== -1;
}