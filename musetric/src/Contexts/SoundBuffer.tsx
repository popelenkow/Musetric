import React, { useMemo, useState } from 'react';
import { saveAs } from 'file-saver';
import { SoundBuffer, createSoundBuffer, createWavCoder } from '..';

export type SoundBufferStore = {
	soundBuffer: SoundBuffer;
	soundBlob?: Blob;
	refreshSoundBlob: () => Promise<void>;
	setFile: (file: File) => Promise<void>;
	saveFile: (fileName: string) => void;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SoundBufferContext = React.createContext<SoundBufferStore>({} as any);

export const SoundBufferConsumer = SoundBufferContext.Consumer;

export type SoundBufferProviderProps = {
};

export const SoundBufferProvider: React.FC<SoundBufferProviderProps> = (props) => {
	const { children } = props;

	const sampleRate = 48000;
	const channelCount = 2;

	const soundBuffer = useMemo(() => createSoundBuffer(sampleRate, channelCount), []);
	const wavCoder = useMemo(() => createWavCoder(), []);
	// eslint-disable-next-line prefer-const
	let [audioContext, setAudioContext] = useState<AudioContext>();
	const [soundBlob, setSoundBlob] = useState<Blob>();

	const getAudioContext = () => {
		if (!audioContext) {
			audioContext = new AudioContext();
			setAudioContext(audioContext);
		}
		return audioContext;
	};

	const getSoundBlob = async (): Promise<Blob> => {
		const { buffers } = soundBuffer;
		const blob = await wavCoder.encode({ buffers, sampleRate });
		setSoundBlob(blob);
		return blob;
	};

	const setFile = async (file: File) => {
		audioContext = getAudioContext();
		const arrayBuffer = await file.arrayBuffer();
		const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
		const buffers: Float32Array[] = [];
		for (let i = 0; i < soundBuffer.channelCount; i++) {
			buffers[i] = audioBuffer.getChannelData(i);
		}
		soundBuffer.push(buffers);
		await getSoundBlob();
	};

	const saveFile = async (name: string) => {
		const blob = await getSoundBlob();
		saveAs(blob, name);
	};

	const store: SoundBufferStore = {
		soundBuffer,
		soundBlob,
		refreshSoundBlob: () => getSoundBlob().then(),
		setFile,
		saveFile,
	};

	return (
		<SoundBufferContext.Provider value={store}>
			{children}
		</SoundBufferContext.Provider>
	);
};
