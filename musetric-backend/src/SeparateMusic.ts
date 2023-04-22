import { spawn } from 'child_process';
import path from 'path';

const getOutText = (data: unknown): string | undefined => {
	if (typeof data === 'object' && data) {
		return data.toString().trimEnd();
	}
	if (typeof data === 'string') {
		return data;
	}
	return undefined;
};
export const separateMusic = (
	musicPath: string,
): Promise<string[]> => new Promise<string[]>((resolve, reject) => {
	const results: string[] = [];
	let error: string | undefined;
	const dir = path.dirname(musicPath);
	const filePath = path.basename(musicPath);
	const task = spawn('demucs', ['-d', 'cpu', filePath], {
		cwd: dir,
	});
	task.stdout.on('data', (data: unknown) => {
		const text = getOutText(data);
		if (!text) return;
		results.push(text);
	});
	task.stderr.on('data', (data) => {
		const text = getOutText(data);
		if (!text) return;
		// ToDo: Fix demucs
		if (text) return;
		error = text;
	});
	task.on('close', (code) => {
		if (error) {
			reject(error);
			return;
		}
		if (code !== 0) {
			const err = `code: ${code ?? 'null'}`;
			reject(err);
			return;
		}
		resolve(results);
	});
});
