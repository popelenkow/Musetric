import { WorkerUrl } from 'worker-url';
import { CreateMusetricApp, CreateMusetricAppOptions } from './types/musetricApp';

declare const createMusetricApp: CreateMusetricApp;
declare const getMusetricLocaleEntries: () => CreateMusetricAppOptions['allLocaleEntries'];
declare const getMusetricThemeEntries: () => CreateMusetricAppOptions['allThemeEntries'];
declare const getMusetricIcons: () => CreateMusetricAppOptions['icons'];
const getMusetricWorkers = (): CreateMusetricAppOptions['workers'] => {
	const recorderUrl = new WorkerUrl(new URL('./musetricRecorder.ts', import.meta.url), {
		name: 'musetricRecorder',
	});
	const spectrumUrl = new WorkerUrl(new URL('./musetricSpectrum.ts', import.meta.url), {
		name: 'musetricSpectrum',
	});
	const wavConverterUrl = new WorkerUrl(new URL('./musetricWavConverter.ts', import.meta.url), {
		name: 'musetricWavConverter',
	});
	return {
		recorderUrl,
		spectrumUrl,
		wavConverterUrl,
	};
};

const run = async () => {
	const elementId = 'root';
	const allLocaleEntries = getMusetricLocaleEntries();
	const allThemeEntries = getMusetricThemeEntries();
	const icons = getMusetricIcons();
	const workers = getMusetricWorkers();

	const options: CreateMusetricAppOptions = {
		elementId,
		allLocaleEntries,
		allThemeEntries,
		icons,
		workers,
	};
	await createMusetricApp(options);
};

run().finally(() => {});
