import { runSpectrumWorker } from 'musetric/SoundProcessing/SpectrumWorker';

declare const self: Worker;
runSpectrumWorker(self);
