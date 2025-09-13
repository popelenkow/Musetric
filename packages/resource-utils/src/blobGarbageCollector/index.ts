import { BlobStorage } from '../blobStorage';
import { createCallLatest } from '../callLatest';
import { createScheduler, Scheduler } from '../scheduler';
import { collectGarbage } from './common';

export type CreateBlobGarbageCollectorOptions = {
  blobStorage: BlobStorage;
  gcIntervalMs: number;
  blobRetentionMs: number;
  getReferencedBlobIds: () => Promise<string[]>;
};
export const createBlobGarbageCollector = (
  options: CreateBlobGarbageCollectorOptions,
): Scheduler => {
  const { blobStorage, gcIntervalMs, blobRetentionMs, getReferencedBlobIds } =
    options;

  const ref = createScheduler(
    createCallLatest(async () => {
      const referencedBlobIds = await getReferencedBlobIds();
      await collectGarbage(blobStorage, blobRetentionMs, referencedBlobIds);
    }),
    gcIntervalMs,
  );

  return ref;
};
