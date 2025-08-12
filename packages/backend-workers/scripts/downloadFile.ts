import fs from 'fs';
import { basename } from 'node:path';
import axios from 'axios';

const formatBytes = (bytes: number): string => {
  return bytes.toLocaleString('en-US').replace(/,/g, '_');
};

const createProgressText = (
  fileName: string,
  downloaded: number,
  total: number,
): string => {
  const getPercentProgress = () =>
    `${((downloaded / total) * 100).toFixed(1)}%`;

  const getBytesProgress = () =>
    `(${formatBytes(downloaded)}/${formatBytes(total)} bytes)`;

  return total > 0
    ? `Downloading ${fileName}... ${getPercentProgress()} ${getBytesProgress()}`
    : `Downloading ${fileName}... ${formatBytes(downloaded)} bytes`;
};

export const downloadFile = async (
  url: string,
  filePath: string,
): Promise<void> => {
  const fileName = basename(filePath);

  const response = await axios({
    method: 'get',
    url,
    responseType: 'stream',
  });

  let totalSize = Number(response.headers['content-length'] ?? 0);
  let downloadedSize = 0;

  const writer = fs.createWriteStream(filePath);

  response.data.on('data', (chunk: Buffer) => {
    downloadedSize += chunk.length;

    if (totalSize > 0 && downloadedSize > totalSize) {
      totalSize = downloadedSize;
    }

    const progressText = createProgressText(
      fileName,
      downloadedSize,
      totalSize,
    );
    process.stdout.write('\r' + progressText);
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', () => {
      process.stdout.write('\n');
      console.log('Download completed!');
      resolve();
    });
    writer.on('error', () => {
      process.stdout.write('\n');
      console.error('Download failed!');
      reject();
    });
  });
};
