import React, { useContext, useState } from 'react';
import { Recorder, createRecorder, SoundDeviceContext } from '..';

export type RecorderStore = {
	recorder?: Recorder;
	startRecord: () => Promise<void>;
	stopRecord: () => Promise<Blob>;
	isRecording: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const RecorderContext = React.createContext<RecorderStore>({} as any);

export const RecorderConsumer = RecorderContext.Consumer;

export type RecorderProviderProps = {
};

export const RecorderProvider: React.FC<RecorderProviderProps> = (props) => {
	const { children } = props;

	const { getSoundDevice } = useContext(SoundDeviceContext);
	// eslint-disable-next-line prefer-const
	let [recorder, setRecorder] = useState<Recorder>();
	const [isRecording, setIsRecording] = useState<boolean>(false);

	const startRecord = async () => {
		if (!recorder) {
			const { audioContext, soundBuffer } = getSoundDevice();
			recorder = await createRecorder(audioContext, soundBuffer);
			setRecorder(recorder);
		}
		await recorder.start();
		setIsRecording(true);
	};

	const stopRecord = async () => {
		const { soundBuffer, wavCoder } = getSoundDevice();
		recorder && await recorder.stop();
		setIsRecording(false);
		const { buffers, sampleRate } = soundBuffer;
		const b = await wavCoder.encode({ buffers, sampleRate });
		return b;
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
