import { createCallLatest } from '@musetric/resource-utils/callLatest';
import { createScheduler } from '../scheduler';
import { collectGarbage, gcTimeoutMs } from './common';

export type BlobGarbageCollector = {
  start: () => void;
  stop: () => void;
};

export const createBlobGarbageCollector = (): BlobGarbageCollector => {
  const scheduler = createScheduler(
    createCallLatest(collectGarbage),
    gcTimeoutMs,
  );

  const ref: BlobGarbageCollector = scheduler;

  return ref;
};
