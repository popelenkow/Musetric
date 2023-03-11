import React from 'react';
import { useAppLocale } from '../../App/AppContext';
import { Button, ButtonProps } from '../../Controls/Button';
import { Icon } from '../../Controls/Icon';
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

	const { i18n } = useAppLocale();

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
			<Icon name='save' />
		</Button>
	);
};
