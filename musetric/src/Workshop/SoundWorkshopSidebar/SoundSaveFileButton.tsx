import React, { FC } from 'react';
import { useIconContext } from '../../AppContexts/Icon';
import { useLocaleContext } from '../../AppContexts/Locale';
import { SoundBufferManager } from '../../Sounds/SoundBufferManager';
import { Button, ButtonProps } from '../../Controls/Button';
import { saveBlobFile } from '../../Utils/SaveBlobFile';
import { createWav } from '../../Sounds';

export type SoundSaveFileButtonProps = {
	soundBufferManager: SoundBufferManager;
};
export const SoundSaveFileButton: FC<SoundSaveFileButtonProps> = (props) => {
	const { soundBufferManager } = props;

	const { SaveIcon } = useIconContext();
	const { i18n } = useLocaleContext();

	const saveFile = (name: string) => {
		const getBlob = (): Blob => {
			const { soundBuffer } = soundBufferManager;
			const { buffers, sampleRate } = soundBuffer;
			const blob = createWav(buffers.map((x) => x.real), sampleRate);
			return blob;
		};
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
