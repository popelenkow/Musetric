import fs from 'fs/promises';
import { blobStorage } from '../blobStorage';
import { getBlobPath } from '../blobStorage/common';
import { prisma } from '../prisma';

export const gcTimeoutMs = 5 * 60 * 1000;
const minAgeMs = 5 * 60 * 1000;

const isOldBlob = async (blobId: string): Promise<boolean> => {
  const now = Date.now();
  const blobPath = getBlobPath(blobId);
  const stat = await fs.stat(blobPath);
  const ageMs = now - stat.mtimeMs;
  return ageMs >= minAgeMs;
};

const getReferencedBlobIds = async (): Promise<Set<string>> => {
  const [sounds, previews] = await Promise.all([
    prisma.sound.findMany({ select: { blobId: true } }),
    prisma.preview.findMany({ select: { blobId: true } }),
  ]);

  return new Set([
    ...sounds.map((sound) => sound.blobId),
    ...previews.map((preview) => preview.blobId),
  ]);
};

export const collectGarbage = async (): Promise<void> => {
  const referencedBlobs = await getReferencedBlobIds();

  const existingBlobIds = await blobStorage.getAllBlobIds();
  const unreferencedBlobs = existingBlobIds.filter(
    (blobId) => !referencedBlobs.has(blobId),
  );

  for (const blobId of unreferencedBlobs) {
    if (await isOldBlob(blobId)) {
      try {
        await blobStorage.remove(blobId);
      } catch (error) {
        console.error('Failed to remove blob:', blobId, error);
      }
    }
  }
};
