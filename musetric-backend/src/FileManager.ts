import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream';
import util from 'util';
import { BusboyFileStream } from '@fastify/busboy';

const pump = util.promisify(pipeline);

export const resourceDir = 'tmp/';

export const createDir = async (dirPath: string): Promise<void> => {
	await fs.promises.mkdir(dirPath, { recursive: true });
};
export const removeDir = async (dirName: string): Promise<void> => {
	if (!fs.existsSync(dirName)) return;
	await fs.promises.rm(dirName, { recursive: true });
};
export const getDirectories = async (dirName: string): Promise<string[]> => {
	const files = await fs.promises.readdir(dirName, { withFileTypes: true });
	const dirs = files.filter((x) => x.isDirectory()).map((x) => x.name);
	return dirs;
};
export const readJson = async <T>(pathName: string): Promise<T | undefined> => {
	if (!fs.existsSync(pathName)) return undefined;
	const text = await fs.promises.readFile(pathName, 'utf8');
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const result: T = JSON.parse(text);
	return result;
};
export const writeJson = async (pathName: string, value: unknown): Promise<void> => {
	const dirPath = path.dirname(pathName);
	await fs.promises.mkdir(dirPath, { recursive: true });
	const text = JSON.stringify(value, null, 4);
	await fs.promises.writeFile(pathName, text, 'utf8');
};
export const writeStream = async (pathName: string, rStream: BusboyFileStream): Promise<void> => {
	const dirName = path.dirname(pathName);
	await fs.promises.mkdir(dirName, { recursive: true });
	const wStream = fs.createWriteStream(pathName);
	await pump(rStream, wStream);
	wStream.end();
};
