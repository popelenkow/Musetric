import { runPython } from './RunPython';

export const getMusicChunksCount = async (
	dirPath: string,
	ext: string,
	milliseconds: number,
): Promise<number> => {
	const results = await runPython('GetMusicChunksCount.py', [dirPath, ext, `${milliseconds}`]);
	return Number(results[0]);
};
