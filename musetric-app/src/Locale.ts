import { allLocaleEntries } from './Resources/Locales';
import type { CreateMusetricAppOptions } from './App';

export const getMusetricLocaleEntries = (): CreateMusetricAppOptions['allLocaleEntries'] => {
	return allLocaleEntries;
};
