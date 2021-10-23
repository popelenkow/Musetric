import React, { useState, useMemo, FC } from 'react';
import { Checkbox, CheckboxProps } from '../Controls/Checkbox';
import { SoundBufferManager } from '../Sounds';
import { createRecorder, Recorder } from '../SoundProcessing/Recorder';
import { useIconContext } from '../AppContexts/Icon';
import { useWorkerContext } from '../AppContexts/Worker';

export type RecorderCheckboxProps = {
	disabled: boolean;
};
export type SoundRecorder = {
	isRecording: boolean;
	initRecorder: () => Promise<Recorder>;
	RecorderCheckbox: FC<RecorderCheckboxProps>;
};
export const useSoundRecorder = (soundBufferManager: SoundBufferManager): SoundRecorder => {
	const { RecordIcon } = useIconContext();
	const { recorderUrl } = useWorkerContext();

	const getRecorder = useMemo(() => {
		let recorder: Recorder | undefined;
		return async () => {
			if (!recorder) {
				const { soundBuffer } = soundBufferManager;
				const { channelCount } = soundBuffer;
				recorder = await createRecorder(recorderUrl, channelCount);
				recorder.onProcess = (options): void => {
					const { chunk, isRecording } = options;
					soundBufferManager.push(chunk, isRecording ? 'recording' : 'live');
				};
			}
			return recorder;
		};
	}, [recorderUrl, soundBufferManager]);

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
