export type SeparationTaskInfo = {
	status: 'created' | 'progress' | 'success',
	id: string,
	chunkMilliseconds: number,
	chunksCount: number,
	chunksDone: number[],
	ext: string,
};
