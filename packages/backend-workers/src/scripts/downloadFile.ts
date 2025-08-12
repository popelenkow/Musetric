import fs from 'node:fs';
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
  const parts = [`Downloading ${fileName}...`];

  if (total > 0) {
    const percent = (downloaded / total) * 100;
    const downloadedBytes = formatBytes(downloaded);
    const totalBytes = formatBytes(total);

    parts.push(`${percent.toFixed(1)}%`);
    parts.push(`(${downloadedBytes}/${totalBytes} bytes)`);
  } else {
    parts.push(`${formatBytes(downloaded)} bytes`);
  }

  return parts.join(' ');
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
