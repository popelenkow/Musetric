import { runWavConverterWorker } from 'musetric/SoundProcessing/WavConverterWorker';

declare const self: Worker;
runWavConverterWorker(self);
