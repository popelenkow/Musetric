import fs from 'fs/promises';
import { BlobStorage } from '../blobStorage.js';

export const collectGarbage = async (
  blobStorage: BlobStorage,
  blobRetentionMs: number,
  referencedBlobIds: string[],
): Promise<void> => {
  const hasExceededRetention = async (blobId: string): Promise<boolean> => {
    const now = Date.now();
    const blobPath = blobStorage.getPath(blobId);
    const stat = await fs.stat(blobPath);
    const elapsedMs = now - stat.mtimeMs;
    return elapsedMs >= blobRetentionMs;
  };

  const existingBlobIds = await blobStorage.getAllBlobIds();
  const unreferencedBlobIds = existingBlobIds.filter(
    (blobId) => !referencedBlobIds.includes(blobId),
  );

  for (const blobId of unreferencedBlobIds) {
    if (await hasExceededRetention(blobId)) {
      try {
        await blobStorage.remove(blobId);
      } catch (error) {
        console.error('Failed to remove blob:', blobId, error);
      }
    }
  }
};
