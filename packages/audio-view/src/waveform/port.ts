import { wrapMessagePort } from '@musetric/resource-utils/messagePort';
import {
  type FromWaveformMessage,
  type ToWaveformMessage,
} from './protocol.js';
import waveformWorkerUrl from './worker.ts?worker&url';

export const createWaveformWorker = () => {
  const worker = new Worker(waveformWorkerUrl, { type: 'module' });
  return wrapMessagePort(worker).typed<
    FromWaveformMessage,
    ToWaveformMessage
  >();
};
