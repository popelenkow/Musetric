import React, { useEffect } from 'react';
import { useIconContext, useLocaleContext } from '../../AppContexts';
import { Button, ButtonProps } from '../../Controls';
import { SoundBufferManager } from '../../Sounds';
import { SFC } from '../../UtilityTypes';
import { skipPromise } from '../../Utils';
import { useSoundWorkshopStore } from '../Store';

export type SoundRecorderButtonProps = {
	disabled: boolean,
	soundBufferManager: SoundBufferManager,
	isLive: boolean,
	isRecording: boolean,
	setIsRecording: (value: boolean) => void,
};
export const SoundRecorderButton: SFC<SoundRecorderButtonProps> = (props) => {
	const { disabled, isLive, isRecording, setIsRecording } = props;

	const { RecordIcon } = useIconContext();
	const { i18n } = useLocaleContext();

	const store = useSoundWorkshopStore();

	useEffect(() => {
		if (isLive) skipPromise(store.getRecorder());
	}, [isLive, store]);

	const startRecording = async (): Promise<void> => {
		const recorder = await store.getRecorder();
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
		disabled,
		rounded: true,
		title: i18n.t('Workshop:record'),
		active: isRecording,
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
