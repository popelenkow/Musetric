import { runPython } from './RunPython';

export const getMusicChunksCount = async (
	filePath: string,
	milliseconds: number,
): Promise<number> => {
	const results = await runPython('GetMusicChunksCount.py', [filePath, `${milliseconds}`]);
	return Number(results[0]);
};
