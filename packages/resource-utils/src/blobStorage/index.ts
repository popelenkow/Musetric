import { randomUUID } from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import {
  getBlobPath,
  getDirectoryShardPaths,
  getDirectoriesBlobIds,
} from './common.js';

export type BlobFile = {
  blobId: string;
  filename: string;
  contentType: string;
};
export type BlobPathRef = {
  blobId: string;
  blobPath: string;
};
export type BlobStorage = {
  getPath: (blobId: string) => string;
  createPath: () => BlobPathRef;
  add: (buffer: Buffer) => Promise<string>;
  addFile: (file: File) => Promise<BlobFile>;
  get: (blobId: string) => Promise<Buffer | undefined>;
  remove: (blobId: string) => Promise<void>;
  exists: (blobId: string) => Promise<boolean>;
  getAllBlobIds: () => Promise<string[]>;
};
export const createBlobStorage = (rootPath: string): BlobStorage => {
  const ref: BlobStorage = {
    getPath: (blobId) => getBlobPath(rootPath, blobId),
    createPath: () => {
      const blobId = randomUUID();
      const blobPath = ref.getPath(blobId);
      return { blobId, blobPath };
    },
    add: async (buffer) => {
      const { blobId, blobPath } = ref.createPath();
      const dirPath = path.dirname(blobPath);
      await fs.mkdir(dirPath, { recursive: true });
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
      const blobPath = ref.getPath(blobId);
      return fs.readFile(blobPath).catch(() => undefined);
    },
    remove: async (blobId) => {
      const blobPath = ref.getPath(blobId);
      await fs.unlink(blobPath);
    },
    exists: async (blobId) => {
      const blobPath = ref.getPath(blobId);
      return fs.access(blobPath).then(
        () => true,
        () => false,
      );
    },
    getAllBlobIds: async () => {
      const shardPaths = await getDirectoryShardPaths(rootPath);
      const blobIds = await getDirectoriesBlobIds(shardPaths);
      return blobIds;
    },
  };

  return ref;
};
