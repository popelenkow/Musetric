import { createDir } from './FileManager';
import { runPython } from './RunPython';
import { separationPaths } from './SeparationPaths';

export const sliceMusic = async (
	id: string,
	ext: string,
	milliseconds: number,
): Promise<number> => {
	const inputPath = separationPaths.input(id, ext);
	const inputChunksPath = separationPaths.inputChunks(id);
	await createDir(inputChunksPath);
	const results = await runPython('SliceMusic.py', [inputPath, inputChunksPath, ext, `${milliseconds}`]);
	return Number(results[0]);
};
