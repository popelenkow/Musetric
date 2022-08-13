import { WorkerUrl } from 'worker-url';
import type { CreateMusetricApp, CreateMusetricAppOptions } from './App';

declare const createMusetricApp: CreateMusetricApp;
declare const getMusetricLocaleEntries: () => CreateMusetricAppOptions['allLocaleEntries'];
declare const getMusetricThemeEntries: () => CreateMusetricAppOptions['allThemeEntries'];
declare const getMusetricIcons: () => CreateMusetricAppOptions['icons'];
const getMusetricWorkers = (): CreateMusetricAppOptions['workers'] => {
	const playerUrl = new WorkerUrl(new URL('./Player.ts', import.meta.url), {
		name: 'MusetricPlayer',
	});
	const recorderUrl = new WorkerUrl(new URL('./Recorder.ts', import.meta.url), {
		name: 'MusetricRecorder',
	});
	const spectrumUrl = new WorkerUrl(new URL('./Spectrum.ts', import.meta.url), {
		name: 'MusetricSpectrum',
	});
	return {
		playerUrl,
		recorderUrl,
		spectrumUrl,
	};
};

const run = async (): Promise<void> => {
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
