import React from 'react';
import { useIconContext } from '../../AppContexts/Icon';
import { useLocaleContext } from '../../AppContexts/Locale';
import { Button, ButtonProps } from '../../Controls/Button';
import { createWav } from '../../Sounds/Wav';
import { SFC } from '../../UtilityTypes/React';
import { saveBlobFile } from '../../Utils/SaveBlobFile';
import { SoundWorkshopSnapshot, useSoundWorkshopStore } from '../SoundWorkshopContext';

const select = ({
	soundBufferManager,
}: SoundWorkshopSnapshot) => ({
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
