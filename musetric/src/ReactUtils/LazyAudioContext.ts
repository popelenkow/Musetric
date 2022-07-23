import { useLazyMemo } from './LazyMemo';

export const useLazyAudioContext = (sampleRate: number): () => AudioContext => {
	const getAudioContext = useLazyMemo<AudioContext>((prev) => {
		if (prev?.sampleRate === sampleRate) return prev;
		return new AudioContext({ sampleRate });
	}, [sampleRate]);

	return getAudioContext;
};
