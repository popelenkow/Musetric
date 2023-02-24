import React from 'react';
import { useIconContext, useLocaleContext } from '../../AppContexts';
import { Button, ButtonProps } from '../../Controls';
import { SFC } from '../../UtilityTypes';
import { skipPromise } from '../../Utils';
import { SoundWorkshopStore, useSoundWorkshopStore } from '../Store';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const select = (store: SoundWorkshopStore) => {
	const { isPlaying, isRecording, setIsRecording, getRecorder } = store;
	return {
		isPlaying,
		isRecording,
		setIsRecording,
		getRecorder,
	};
};

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
