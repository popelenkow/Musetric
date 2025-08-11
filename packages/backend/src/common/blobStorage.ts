import crypto, { randomUUID } from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { envs } from './envs';

const getBlobPath = (rootPath: string, blobId: string) => {
  const hash = crypto.createHash('sha256').update(blobId).digest('hex');
  const level1 = hash.substring(0, 2);
  const level2 = hash.substring(2, 4);
  return path.join(rootPath, level1, level2, blobId);
};
export type BlobFile = {
  blobId: string;
  filename: string;
  contentType: string;
};
export type BlobStorage = {
  add: (buffer: Buffer) => Promise<string>;
  addFile: (file: File) => Promise<BlobFile>;
  get: (blobId: string) => Promise<Buffer | undefined>;
  remove: (blobId: string) => Promise<void>;
  exists: (blobId: string) => Promise<boolean>;
};

export const createBlobStorage = (rootPath: string): BlobStorage => {
  const ref: BlobStorage = {
    add: async (buffer) => {
      const blobId = randomUUID();
      const blobPath = getBlobPath(rootPath, blobId);
      const shardPath = path.dirname(blobPath);

      await fs.mkdir(shardPath, { recursive: true });
      await fs.writeFile(blobPath, buffer);

      return blobId;
    },
    addFile: async (file) => {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const blobId = await ref.add(buffer);
      return {
        blobId,
        filename: file.name,
        contentType: file.type,
      };
    },
    get: async (blobId) => {
      const blobPath = getBlobPath(rootPath, blobId);
      return fs.readFile(blobPath).catch(() => undefined);
    },
    remove: async (blobId) => {
      const blobPath = getBlobPath(rootPath, blobId);
      await fs.unlink(blobPath);
    },
    exists: async (blobId) => {
      const blobPath = getBlobPath(rootPath, blobId);
      return fs.access(blobPath).then(
        () => true,
        () => false,
      );
    },
  };

  return ref;
};

export const blobStorage = createBlobStorage(envs.blobsPath);
