import { wrapMessagePort } from '@musetric/resource-utils/cross/messagePort';
import waveformWorkerUrl from './index.worker.ts?worker&url';
import {
  type FromWaveformWorkerMessage,
  type ToWaveformWorkerMessage,
} from './protocol.es.js';

export const createWaveformWorker = () => {
  const worker = new Worker(waveformWorkerUrl, { type: 'module' });
  return wrapMessagePort(worker).typed<
    FromWaveformWorkerMessage,
    ToWaveformWorkerMessage
  >();
};
