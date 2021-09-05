import { CreateMusetricApp, CreateMusetricAppOptions } from './types/musetricApp';

declare const createMusetricApp: CreateMusetricApp;
declare const getMusetricLocaleEntries: () => CreateMusetricAppOptions['allLocaleEntries'];
declare const getMusetricThemeEntries: () => CreateMusetricAppOptions['allThemeEntries'];
declare const getMusetricIcons: () => CreateMusetricAppOptions['icons'];

const run = async () => {
	const elementId = 'root';
	const allLocaleEntries = getMusetricLocaleEntries();
	const allThemeEntries = getMusetricThemeEntries();
	const icons = getMusetricIcons();
	const options: CreateMusetricAppOptions = {
		elementId,
		allLocaleEntries,
		allThemeEntries,
		icons,
	};
	await createMusetricApp(options);
};

run().finally(() => {});
