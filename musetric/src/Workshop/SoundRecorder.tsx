import React, { useState, useMemo, FC } from 'react';
import { Checkbox, CheckboxProps } from '../Controls/Checkbox';
import { SoundBuffer, SoundCircularBuffer } from '../Sounds';
import { createRecorder, Recorder } from '../SoundProcessing/Recorder';
import { useIconContext } from '../AppContexts/Icon';
import { useWorkerContext } from '../AppContexts/Worker';

export type UseSoundRecorderProps = {
	soundBuffer: SoundBuffer;
	soundCircularBuffer: SoundCircularBuffer;
};
export type RecorderCheckboxProps = {
	disabled: boolean;
};
export type SoundRecorder = {
	isRecording: boolean;
	initRecorder: () => Promise<Recorder>;
	RecorderCheckbox: FC<RecorderCheckboxProps>;
};
export const useSoundRecorder = (props: UseSoundRecorderProps): SoundRecorder => {
	const { soundBuffer, soundCircularBuffer } = props;
	const { RecordIcon } = useIconContext();
	const { recorderUrl } = useWorkerContext();

	const getRecorder = useMemo(() => {
		let recorder: Recorder | undefined;
		return async () => {
			if (!recorder) {
				const { channelCount } = soundBuffer;
				recorder = await createRecorder(recorderUrl, channelCount);
				recorder.onProcess = (options): void => {
					const { chunk, isRecording } = options;
					if (isRecording) soundBuffer.push(chunk);
					soundCircularBuffer.push(chunk);
				};
			}
			return recorder;
		};
	}, [recorderUrl, soundBuffer, soundCircularBuffer]);

	const [isRecording, setIsRecording] = useState<boolean>(false);
	const startRecording = async () => {
		const recorder = await getRecorder();
		await recorder.start();
		setIsRecording(true);
	};

	const stopRecording = async () => {
		const recorder = await getRecorder();
		await recorder.stop();
		setIsRecording(false);
	};

	const RecorderCheckbox: FC<RecorderCheckboxProps> = (recorderCheckboxProps) => {
		const { disabled } = recorderCheckboxProps;
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
		RecorderCheckbox,
	};
};
