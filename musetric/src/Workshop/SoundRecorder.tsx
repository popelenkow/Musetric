import React, { useState, useMemo, ReactElement } from 'react';
import { useLocaleContext } from '../AppContexts/Locale';
import { useIconContext } from '../AppContexts/Icon';
import { useWorkerContext } from '../AppContexts/Worker';
import { Button, ButtonProps } from '../Controls/Button';
import { SoundBufferManager } from '../Sounds';
import { createRecorder, Recorder } from '../SoundProcessing/Recorder';
import { skipPromise } from '../Utils/SkipPromise';

export type RecorderButtonProps = {
	disabled: boolean;
};
export type SoundRecorder = {
	isRecording: boolean;
	initRecorder: () => Promise<Recorder>;
	renderRecorderButton: (props: RecorderButtonProps) => ReactElement;
};
export const useSoundRecorder = (soundBufferManager: SoundBufferManager): SoundRecorder => {
	const { RecordIcon } = useIconContext();
	const { recorderUrl } = useWorkerContext();
	const { i18n } = useLocaleContext();

	const getRecorder = useMemo(() => {
		let recorder: Recorder | undefined;
		return async () => {
			if (!recorder) {
				const { soundBuffer } = soundBufferManager;
				const { channelCount } = soundBuffer;
				recorder = await createRecorder(recorderUrl, channelCount, {
					onProcess: (event): void => {
						const { chunk, isRecording } = event;
						soundBufferManager.push(chunk, isRecording ? 'recording' : 'live');
					},
				});
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

	return {
		isRecording,
		initRecorder: getRecorder,
		renderRecorderButton: (recorderCheckboxProps) => {
			const { disabled } = recorderCheckboxProps;
			const recorderProps: ButtonProps = {
				kind: 'icon',
				disabled,
				rounded: true,
				title: i18n.t('Workshop:record'),
				active: isRecording,
				primary: isRecording,
				onClick: () => skipPromise(isRecording ? stopRecording() : startRecording()),
			};

			return (
				<Button {...recorderProps}>
					<RecordIcon />
				</Button>
			);
		},
	};
};
