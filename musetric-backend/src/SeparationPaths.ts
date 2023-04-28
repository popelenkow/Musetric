import { SeparationTrackType } from 'musetric-api/Music';

export const resourceDir = 'tmp/';

const pad2 = (value: number): string => {
	return `${value < 10 ? '0' : ''}${value}`;
};

export const separationPaths = {
	root: (id: string) => `${resourceDir}${id}/` as const,
	info: (id: string) => `${resourceDir}${id}/info.json` as const,
	input: (id: string, ext: string) => `${resourceDir}${id}/input${ext}` as const,
	inputChunks: (id: string) => `${resourceDir}${id}/inputChunks/` as const,
	inputChunk: (id: string, chunkIndex: number, ext: string) => `${resourceDir}${id}/inputChunks/${pad2(chunkIndex)}${ext}` as const,
	outputChunk: (id: string, chunkIndex: number, trackType: SeparationTrackType) => `${resourceDir}${id}/inputChunks/separated/htdemucs/${pad2(chunkIndex)}/${trackType}.wav` as const,
};
