import { SeparationTaskInfo } from 'musetric-api/SeparationTaskInfo';
import { getDirectories, readJson, writeJson } from './FileManager';
import { separateMusic } from './SeparateMusic';
import { resourceDir, separationPaths } from './SeparationPaths';
import { sliceMusic } from './SliceMusic';

const getTask = async (): Promise<SeparationTaskInfo | undefined> => {
	const dirs = await getDirectories(resourceDir);
	for (let i = 0; i < dirs.length; i++) {
		const id = dirs[i];
		const infoPath = separationPaths.info(id);
		// eslint-disable-next-line no-await-in-loop
		const info = await readJson<SeparationTaskInfo>(infoPath);
		if (info?.status === 'created' || info?.status === 'progress') return info;
	}
	return undefined;
};

const handlers = {
	created: async (info: SeparationTaskInfo): Promise<void> => {
		await sliceMusic(info.id, info.ext, info.chunkMilliseconds);
		const result: SeparationTaskInfo = {
			...info,
			status: 'progress',
		};
		await writeJson(separationPaths.info(info.id), result);
	},
	progress: async (info: SeparationTaskInfo): Promise<void> => {
		const getChunkIndex = (): number | undefined => {
			for (let i = 0; i < info.chunksCount; i++) {
				if (!info.chunksDone.includes(i)) return i;
			}
			return undefined;
		};
		const chunkIndex = getChunkIndex();
		if (chunkIndex === undefined) {
			throw new Error('Broken progress separation task status');
		}
		const filePath = separationPaths.inputChunk(info.id, chunkIndex, info.ext);
		await separateMusic(filePath);
		const chunksDone = [...info.chunksDone, chunkIndex];
		const done = chunksDone.length === info.chunksCount;
		const result: SeparationTaskInfo = {
			...info,
			chunksDone: [...info.chunksDone, chunkIndex],
			status: done ? 'success' : info.status,
		};
		await writeJson(separationPaths.info(info.id), result);
	},
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
		const task = await getTask();
		if (!task) return 'nothing';
		if (task.status === 'created') {
			await handlers.created(task);
			return 'next';
		}
		if (task.status === 'progress') {
			await handlers.progress(task);
			return 'next';
		}
		return 'nothing';
	});
};
