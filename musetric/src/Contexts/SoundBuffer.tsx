import React, { useContext, useMemo, useState } from 'react';
import { saveAs } from 'file-saver';
import { SoundBuffer, createSoundBuffer, createWavCoder, Recorder, createRecorder } from '..';

export type SoundBufferStore = {
	soundBuffer: SoundBuffer;
	soundBlob?: Blob;
	setFile: (file: File) => Promise<void>;
	saveFile: (fileName: string) => void;
	recorder?: Recorder;
	isRecording: boolean;
	startRecord: () => Promise<void>;
	stopRecord: () => Promise<void>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SoundBufferContext = React.createContext<SoundBufferStore>({} as any);

export const SoundBufferConsumer = SoundBufferContext.Consumer;

const useAudioContext = () => {
	const [audioContext, setAudioContext] = useState<AudioContext>();

	return () => {
		let result = audioContext;
		if (!result) {
			result = new AudioContext();
			setAudioContext(audioContext);
		}

		const audioBufferSource = result.createBufferSource();
		audioBufferSource.buffer;
		return result;
	};
};

const useRecorder = (soundBuffer: SoundBuffer) => {
	const [recorder, setRecorder] = useState<Recorder>();

	return {
		recorder,
		getRecorder: async () => {
			let result = recorder;
			if (!result) {
				const audioContext = new AudioContext();

				result = await createRecorder(audioContext, soundBuffer);
				setRecorder(result);
			}
			return result;
		},
	};
};

export type SoundBufferProviderProps = {
};

export const SoundBufferProvider: React.FC<SoundBufferProviderProps> = (props) => {
	const { children } = props;

	const soundBuffer = useMemo(() => createSoundBuffer(48000, 2), []);
	const wavCoder = useMemo(() => createWavCoder(), []);
	const [isRecording, setIsRecording] = useState<boolean>(false);
	// eslint-disable-next-line prefer-const
	const [soundBlob, setSoundBlob] = useState<Blob>();

	const getAudioContext = useAudioContext();

	const getSoundBlob = async (): Promise<Blob> => {
		const { buffers, sampleRate } = soundBuffer;
		const blob = await wavCoder.encode({ buffers, sampleRate });
		setSoundBlob(blob);
		return blob;
	};

	const setFile = async (file: File) => {
		const audioContext = getAudioContext();
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

	const { recorder: rec, getRecorder } = useRecorder(soundBuffer);

	const startRecord = async () => {
		const recorder = await getRecorder();
		await recorder.start();
		setIsRecording(true);
	};

	const stopRecord = async () => {
		const recorder = await getRecorder();
		await recorder.stop();
		await getSoundBlob();
		setIsRecording(false);
	};

	const store: SoundBufferStore = {
		soundBuffer,
		soundBlob,
		setFile,
		saveFile,
		recorder: rec,
		isRecording,
		startRecord,
		stopRecord,
	};

	return (
		<SoundBufferContext.Provider value={store}>
			{children}
		</SoundBufferContext.Provider>
	);
};

export const useSoundBuffer = () => useContext(SoundBufferContext);
