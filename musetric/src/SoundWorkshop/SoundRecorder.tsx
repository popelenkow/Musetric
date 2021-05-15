import React, { useState } from 'react';

import {
	SoundBuffer, SoundCircularBuffer, createRecorder, Recorder,
	Checkbox, CheckboxProps, RecordIcon,
} from '..';

export type UseSoundRecorderProps = {
	soundBuffer: SoundBuffer;
	soundCircularBuffer: SoundCircularBuffer;
	refreshSound: () => Promise<void>;
};

export const useSoundRecorder = (props: UseSoundRecorderProps) => {
	const { soundBuffer, soundCircularBuffer, refreshSound } = props;

	const [recorderState, setRecorder] = useState<Recorder>();
	const getRecorder = async () => {
		let recorder = recorderState;
		if (!recorder) {
			const audioContext = new AudioContext();

			const onChunk = (chunk: Float32Array[], isRecording: boolean): void => {
				isRecording && soundBuffer.push(chunk);
				soundCircularBuffer.push(chunk);
			};
			const { channelCount } = soundBuffer;
			recorder = await createRecorder({ audioContext, channelCount, onChunk });
			setRecorder(recorder);
		}
		return recorder;
	};

	const [isRecording, setIsRecording] = useState<boolean>(false);
	const startRecording = async () => {
		const recorder = await getRecorder();
		await recorder.start();
		setIsRecording(true);
	};

	const stopRecording = async () => {
		const recorder = await getRecorder();
		await recorder.stop();
		await refreshSound();
		setIsRecording(false);
	};

	const getRecorderCheckbox = (disabled: boolean) => {
		const recorderProps: CheckboxProps = {
			disabled,
			checked: isRecording,
			onToggle: () => (isRecording ? stopRecording() : startRecording()),
		};

		return <Checkbox {...recorderProps}><RecordIcon /></Checkbox>;
	};

	return {
		isRecording,
		initRecorder: getRecorder,
		getRecorderCheckbox,
	};
};
