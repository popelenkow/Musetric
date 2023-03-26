import { SeparationTaskInfo } from 'musetric-api/SeparationTaskInfo';
import { getDirectories, readJson, resourceDir, writeJson } from './FileManager';
import { separateMusic } from './SeparateMusic';
import { sliceMusic } from './SliceMusic';

const pad2 = (value: number): string => {
	return `${value < 10 ? '0' : ''}${value}`;
};

const loopCallback = (callback: () => Promise<'next' | 'nothing' | 'stop'>, timeout = 5000): void => {
	const next = async (): Promise<void> => {
		const status = await callback();
		if (status === 'next') loopCallback(callback, 100);
		if (status === 'nothing') loopCallback(callback);
	};
	setTimeout(() => {
		next().finally(() => {});
	}, timeout);
};

export const runLongLoopWorker = (): void => {
	loopCallback(async () => {
		type SeparationTask = {
			dir: string,
			info: SeparationTaskInfo,
		};
		const getTask = async (): Promise<SeparationTask | undefined> => {
			const dirs = await getDirectories(resourceDir);
			for (let i = 0; i < dirs.length; i++) {
				const dir = `${resourceDir}${dirs[i]}/`;
				// eslint-disable-next-line no-await-in-loop
				const info = await readJson<SeparationTaskInfo>(`${dir}info.json`);
				if (info?.status === 'created' || info?.status === 'progress') return { dir, info };
			}
			return undefined;
		};
		const task = await getTask();
		if (!task) return 'nothing';
		if (task.info.status === 'created') {
			await sliceMusic(task.dir, task.info.ext, task.info.chunkMilliseconds);
			const info: SeparationTaskInfo = {
				...task.info,
				status: 'progress',
			};
			await writeJson(`${task.dir}info.json`, info);
			return 'next';
		}
		if (task.info.status === 'progress') {
			const getChunkIndex = (): number | undefined => {
				for (let i = 0; i < task.info.chunksCount; i++) {
					if (!task.info.chunksDone.includes(i)) return i;
				}
				return undefined;
			};
			const chunkIndex = getChunkIndex();
			if (chunkIndex === undefined) return 'nothing';
			await separateMusic(`${task.dir}inputChunks/${pad2(chunkIndex)}${task.info.ext}`);
			const chunksDone = [...task.info.chunksDone, chunkIndex];
			const done = chunksDone.length === task.info.chunksCount;
			const info: SeparationTaskInfo = {
				...task.info,
				chunksDone: [...task.info.chunksDone, chunkIndex],
				status: done ? 'success' : task.info.status,
			};
			await writeJson(`${task.dir}info.json`, info);
			return 'next';
		}
		return 'nothing';
	});
};
