import React from 'react';
import { useIconContext, useLocaleContext } from '../../AppContexts';
import { Button, ButtonProps } from '../../Controls';
import { SFC } from '../../UtilityTypes';
import { skipPromise } from '../../Utils';
import { SoundWorkshopSnapshot, useSoundWorkshopStore } from '../Store';

const select = ({
	isPlaying, isRecording, setIsRecording, getRecorder,
}: SoundWorkshopSnapshot) => ({
	isPlaying, isRecording, setIsRecording, getRecorder,
} as const);

export const SoundRecorderButton: SFC = () => {
	const store = useSoundWorkshopStore(select);
	const { isPlaying, isRecording, setIsRecording, getRecorder } = store;

	const { RecordIcon } = useIconContext();
	const { i18n } = useLocaleContext();

	const startRecording = async (): Promise<void> => {
		const recorder = await getRecorder();
		await recorder.start();
		setIsRecording(true);
	};
	const stopRecording = async (): Promise<void> => {
		const recorder = await store.getRecorder();
		await recorder.stop();
		setIsRecording(false);
	};

	const recorderProps: ButtonProps = {
		kind: 'icon',
		disabled: isPlaying,
		rounded: true,
		title: i18n.t('Workshop:record'),
		primary: isRecording,
		onClick: () => {
			if (isRecording) {
				skipPromise(stopRecording());
				return;
			}
			skipPromise(startRecording());
		},
	};

	return (
		<Button {...recorderProps}>
			<RecordIcon />
		</Button>
	);
};
