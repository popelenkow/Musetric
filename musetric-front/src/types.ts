export type Theme = 'dark' | 'white'
export const isTheme = (value: any): value is Theme => {
    const keys: Theme[] = ['dark', 'white'];
    return keys.indexOf(value) !== -1;
}