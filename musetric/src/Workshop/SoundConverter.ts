import { useMemo, useCallback } from 'react';
import { useWorkerContext } from '../AppContexts/Worker';
import { SoundBufferManager } from '../Sounds/SoundBufferManager';
import { createWavConverter } from '../SoundProcessing/WavConverter';
import { useCache } from '../Hooks/Cache';

export type SoundConverter = {
	getBlob: () => Promise<Blob>;
	pushFile: (file: File) => Promise<void>;
};
export const useSoundConverter = (soundBufferManager: SoundBufferManager): SoundConverter => {
	const { wavConverterUrl } = useWorkerContext();

	const [getAudioContext, getAudioContextState] = useCache<AudioContext>(() => {
		const { soundBuffer } = soundBufferManager;
		const { sampleRate } = soundBuffer;
		return new AudioContext({ sampleRate });
	}, [soundBufferManager]);

	const wavConverter = useMemo(
		() => createWavConverter(wavConverterUrl),
		[wavConverterUrl],
	);
	const getBlob = useCallback(async (): Promise<Blob> => {
		const { soundBuffer } = soundBufferManager;
		const { buffers, sampleRate } = soundBuffer;
		const blob = await wavConverter.encode(buffers.map((x) => x.real), sampleRate);
		return blob;
	}, [wavConverter, soundBufferManager]);

	const pushFile = useCallback(async (file: File) => {
		const { soundBuffer } = soundBufferManager;
		const { sampleRate } = soundBuffer;
		const needRefresh = () => {
			const prevState = getAudioContextState();
			if (!prevState.value) return true;
			const prevSampleRate = prevState.value.sampleRate;
			const result = prevSampleRate !== sampleRate;
			return result;
		};
		const audioContext = getAudioContext(needRefresh());
		const arrayBuffer = await file.arrayBuffer();
		const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
		const buffers: Float32Array[] = [];
		for (let i = 0; i < soundBuffer.channelCount; i++) {
			buffers[i] = audioBuffer.getChannelData(i);
		}
		soundBufferManager.push(buffers, 'file');
	}, [soundBufferManager, getAudioContext, getAudioContextState]);

	return {
		getBlob,
		pushFile,
	};
};
