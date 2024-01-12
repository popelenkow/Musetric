import { allThemeEntries } from 'musetric/Resources/Themes';
import { CreateMusetricAppOptions } from './App';

export const getMusetricThemeEntries = (): CreateMusetricAppOptions['allThemeEntries'] => {
    return allThemeEntries;
};
