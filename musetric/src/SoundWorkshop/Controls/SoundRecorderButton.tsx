import React, { ReactElement, useEffect } from 'react';
import { useIconContext, useLocaleContext } from '../../AppContexts';
import { Button, ButtonProps } from '../../Controls';
import { SoundBufferManager } from '../../Sounds';
import { skipPromise } from '../../Utils';
import { useSoundWorkshopStore } from '../Store';

export type SoundRecorderButtonProps = {
	disabled: boolean,
	soundBufferManager: SoundBufferManager,
	isLive: boolean,
	isRecording: boolean,
	setIsRecording: (value: boolean) => void,
};
export function SoundRecorderButton(
	props: SoundRecorderButtonProps,
): ReactElement {
	const { disabled, isLive, isRecording, setIsRecording } = props;

	const { RecordIcon } = useIconContext();
	const { i18n } = useLocaleContext();

	const store = useSoundWorkshopStore();

	useEffect(() => {
		if (isLive) skipPromise(store.getRecorder());
	}, [isLive, store]);

	const startRecording = async () => {
		const recorder = await store.getRecorder();
		await recorder.start();
		setIsRecording(true);
	};
	const stopRecording = async () => {
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
}
