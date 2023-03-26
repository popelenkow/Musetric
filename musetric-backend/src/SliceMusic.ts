import { createDir } from './FileManager';
import { runPython } from './RunPython';

export const sliceMusic = async (
	dirPath: string,
	ext: string,
	milliseconds: number,
): Promise<number> => {
	await createDir(`${dirPath}inputChunks/`);
	const results = await runPython('SliceMusic.py', [dirPath, ext, `${milliseconds}`]);
	return Number(results[0]);
};
