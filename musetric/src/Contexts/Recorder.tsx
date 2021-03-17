import React, { useContext, useState } from 'react';
import { Recorder, createRecorder, SoundBufferContext } from '..';

export type RecorderStore = {
	recorder?: Recorder;
	startRecord: () => Promise<void>;
	stopRecord: () => Promise<void>;
	isRecording: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const RecorderContext = React.createContext<RecorderStore>({} as any);

export const RecorderConsumer = RecorderContext.Consumer;

export type RecorderProviderProps = {
};

export const RecorderProvider: React.FC<RecorderProviderProps> = (props) => {
	const { children } = props;

	const { soundBuffer, refreshSoundBlob } = useContext(SoundBufferContext);
	// eslint-disable-next-line prefer-const
	let [recorder, setRecorder] = useState<Recorder>();
	const [isRecording, setIsRecording] = useState<boolean>(false);

	const getRecorder = async () => {
		if (!recorder) {
			const audioContext = new AudioContext();
			recorder = await createRecorder(audioContext, soundBuffer);
			setRecorder(recorder);
		}
		return recorder;
	};

	const startRecord = async () => {
		recorder = await getRecorder();
		await recorder.start();
		setIsRecording(true);
	};

	const stopRecord = async () => {
		recorder = await getRecorder();
		await recorder.stop();
		await refreshSoundBlob();
		setIsRecording(false);
	};

	const store: RecorderStore = {
		recorder, startRecord, stopRecord, isRecording,
	};

	return (
		<RecorderContext.Provider value={store}>
			{children}
		</RecorderContext.Provider>
	);
};
