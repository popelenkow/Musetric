import { allLocaleEntries } from 'musetric/Resources/Locales';
import type { CreateMusetricAppOptions } from './App';

export const getMusetricLocaleEntries = (): CreateMusetricAppOptions['allLocaleEntries'] => {
	return allLocaleEntries;
};
