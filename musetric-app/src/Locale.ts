import type { CreateMusetricAppOptions } from './App';
import { allLocaleEntries } from './Resources/Locales';

export const getMusetricLocaleEntries = (): CreateMusetricAppOptions['allLocaleEntries'] => {
	return allLocaleEntries;
};
