import React, { useState, useMemo } from 'react';
import {
	SoundBuffer, SoundCircularBuffer,
	createRecorder, Recorder, RecorderProcessOptions,
	Checkbox, CheckboxProps, RecordIcon,
} from '..';

export type UseSoundRecorderProps = {
	soundBuffer: SoundBuffer;
	soundCircularBuffer: SoundCircularBuffer;
	refreshSound: () => Promise<void>;
};

export const useSoundRecorder = (props: UseSoundRecorderProps) => {
	const { soundBuffer, soundCircularBuffer, refreshSound } = props;

	const getRecorder = useMemo(() => {
		let recorder: Recorder | undefined;
		return async () => {
			if (!recorder) {
				const process = (options: RecorderProcessOptions): void => {
					const { chunk, isRecording } = options;
					isRecording && soundBuffer.push(chunk);
					soundCircularBuffer.push(chunk);
				};
				const { channelCount } = soundBuffer;
				recorder = await createRecorder({ channelCount, process });
			}
			return recorder;
		};
	}, [soundBuffer, soundCircularBuffer]);

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
