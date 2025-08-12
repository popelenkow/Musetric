import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { envs } from '../envs';

export const getBlobPath = (blobId: string) => {
  const hash = crypto.createHash('sha256').update(blobId).digest('hex');
  const level1 = hash.substring(0, 2);
  const level2 = hash.substring(2, 4);
  return path.join(envs.blobsPath, level1, level2, blobId);
};

const getSubDirectoryPaths = async (
  directoryPath: string,
): Promise<string[]> => {
  const entries = await fs.readdir(directoryPath, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(directoryPath, entry.name));
};

const isDirectoryExists = async (dirPath: string): Promise<boolean> => {
  try {
    const stat = await fs.stat(dirPath);
    return stat.isDirectory();
  } catch {
    return false;
  }
};

const getDirectoryBlobIds = async (
  directoryPath: string,
): Promise<string[]> => {
  const fileEntries = await fs.readdir(directoryPath, { withFileTypes: true });
  return fileEntries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name);
};

export const getDirectoryShardPaths = async (): Promise<string[]> => {
  const rootPath = envs.blobsPath;
  if (!(await isDirectoryExists(rootPath))) {
    return [];
  }
  const level1 = await getSubDirectoryPaths(rootPath);
  const level2 = await Promise.all(level1.map(getSubDirectoryPaths));
  return level2.flat();
};

export const getDirectoriesBlobIds = async (
  directories: string[],
): Promise<string[]> => {
  const blobIdsArray = await Promise.all(directories.map(getDirectoryBlobIds));

  return blobIdsArray.flat();
};
