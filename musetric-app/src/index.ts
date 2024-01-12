import { skipPromise } from 'musetric/Utils/SkipPromise';
import { WorkerUrl } from 'worker-url';
import type { CreateMusetricApp, CreateMusetricAppOptions } from './App';
import { getLocalIp } from './ip';

declare const createMusetricApp: CreateMusetricApp;
declare const getMusetricLocaleEntries: () => CreateMusetricAppOptions['allLocaleEntries'];
declare const getMusetricThemeEntries: () => CreateMusetricAppOptions['allThemeEntries'];
const getMusetricWorkers = (): CreateMusetricAppOptions['workers'] => {
    const playerUrl = new WorkerUrl(new URL('./Player.ts', import.meta.url), {
        name: 'MusetricPlayer',
        customPath: () => new URL('MusetricPlayer.js', window.location.href),
    });
    const recorderUrl = new WorkerUrl(new URL('./Recorder.ts', import.meta.url), {
        name: 'MusetricRecorder',
        customPath: () => new URL('MusetricRecorder.js', window.location.href),
    });
    const spectrumUrl = new WorkerUrl(new URL('./Spectrum.ts', import.meta.url), {
        name: 'MusetricSpectrum',
        customPath: () => new URL('MusetricSpectrum.js', window.location.href),
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
    const workers = getMusetricWorkers();

    const ip = await getLocalIp();
    const options: CreateMusetricAppOptions = {
        elementId,
        allLocaleEntries,
        allThemeEntries,
        workers,
        apiUrl: `http://${ip}:3001`,
    };
    await createMusetricApp(options);
};

skipPromise(run());
