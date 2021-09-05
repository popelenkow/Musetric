import { useState, useMemo, useCallback } from 'react';
import { useWorkerContext } from '../AppContexts/WorkerContext';
import { SoundBuffer } from './SoundBuffer';
import { createWavConverter } from './WavConverter';

export const useSoundConverter = (soundBuffer: SoundBuffer) => {
	const { createWavConverterWorker } = useWorkerContext();

	const [audioContextState, setAudioContext] = useState<AudioContext>();
	const getAudioContext = useCallback(() => {
		const { sampleRate } = soundBuffer;
		let audioContext = audioContextState;
		if (!audioContext || (sampleRate !== audioContext.sampleRate)) {
			audioContext = new AudioContext({ sampleRate });
			setAudioContext(audioContext);
		}
		return audioContext;
	}, [soundBuffer, audioContextState]);

	const wavConverter = useMemo(
		() => createWavConverter(createWavConverterWorker),
		[createWavConverterWorker],
	);
	const getBlob = useCallback(async (): Promise<Blob> => {
		const { buffers, sampleRate } = soundBuffer;
		const blob = await wavConverter.encode(buffers, sampleRate);
		return blob;
	}, [wavConverter, soundBuffer]);

	const pushFile = useCallback(async (file: File) => {
		const audioContext = getAudioContext();
		const arrayBuffer = await file.arrayBuffer();
		const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
		const buffers: Float32Array[] = [];
		for (let i = 0; i < soundBuffer.channelCount; i++) {
			buffers[i] = audioBuffer.getChannelData(i);
		}
		soundBuffer.push(buffers);
	}, [soundBuffer, getAudioContext]);

	return {
		getBlob,
		pushFile,
	};
};
