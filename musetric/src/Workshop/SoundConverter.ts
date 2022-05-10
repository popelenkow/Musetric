import { useCallback } from 'react';
import { SoundBufferManager } from '../Sounds/SoundBufferManager';
import { createWav, decodeFileToWav } from '../Sounds/Wav';
import { useLazyAudioContext } from '../Hooks/LazyAudioContext';

export const useSoundConverter = (soundBufferManager: SoundBufferManager) => {
	const getAudioContext = useLazyAudioContext(soundBufferManager.soundBuffer.sampleRate);

	const getBlob = useCallback((): Blob => {
		const { soundBuffer } = soundBufferManager;
		const { buffers, sampleRate } = soundBuffer;
		const blob = createWav(buffers.map((x) => x.real), sampleRate);
		return blob;
	}, [soundBufferManager]);

	const pushFile = useCallback(async (file: File) => {
		const audioContext = getAudioContext();
		const channels = await decodeFileToWav(audioContext, file);
		soundBufferManager.push(channels, 'file');
	}, [soundBufferManager, getAudioContext]);

	return {
		getBlob,
		pushFile,
	} as const;
};
export type SoundConverter = ReturnType<typeof useSoundConverter>;
