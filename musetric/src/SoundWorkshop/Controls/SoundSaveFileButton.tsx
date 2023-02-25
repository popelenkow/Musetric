import React from 'react';
import { useIconContext, useLocaleContext } from '../../AppContexts';
import { Button, ButtonProps } from '../../Controls';
import { createWav } from '../../Sounds';
import { SFC } from '../../UtilityTypes';
import { saveBlobFile } from '../../Utils';
import { SoundWorkshopStore, useSoundWorkshopStore } from '../Store';

const select = ({
	soundBufferManager,
}: SoundWorkshopStore) => ({
	soundBufferManager,
} as const);

export const SoundSaveFileButton: SFC = () => {
	const store = useSoundWorkshopStore(select);
	const { soundBufferManager } = store;

	const { SaveIcon } = useIconContext();
	const { i18n } = useLocaleContext();

	const getBlob = (): Blob => {
		const { soundBuffer } = soundBufferManager;
		const { buffers, sampleRate } = soundBuffer;
		const blob = createWav(buffers.map((x) => x.real), sampleRate);
		return blob;
	};

	const saveFile = (name: string): void => {
		const blob = getBlob();
		saveBlobFile(blob, name);
	};

	const saveFileProps: ButtonProps = {
		kind: 'icon',
		rounded: true,
		title: i18n.t('Workshop:save'),
		onClick: () => saveFile('myRecording.wav'),
	};
	return (
		<Button {...saveFileProps}>
			<SaveIcon />
		</Button>
	);
};
