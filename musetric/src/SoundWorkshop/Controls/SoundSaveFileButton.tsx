import React, { ReactElement } from 'react';
import { useIconContext, useLocaleContext } from '../../AppContexts';
import { SoundBufferManager, createWav } from '../../Sounds';
import { Button, ButtonProps } from '../../Controls';
import { saveBlobFile } from '../../Utils';

export type SoundSaveFileButtonProps = {
	soundBufferManager: SoundBufferManager,
};
export function SoundSaveFileButton(props: SoundSaveFileButtonProps): ReactElement {
	const { soundBufferManager } = props;

	const { SaveIcon } = useIconContext();
	const { i18n } = useLocaleContext();

	const getBlob = (): Blob => {
		const { soundBuffer } = soundBufferManager;
		const { buffers, sampleRate } = soundBuffer;
		const blob = createWav(buffers.map((x) => x.real), sampleRate);
		return blob;
	};

	const saveFile = (name: string) => {
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
}
