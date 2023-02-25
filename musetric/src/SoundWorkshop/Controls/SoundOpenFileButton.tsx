import React from 'react';
import { useIconContext, useLocaleContext } from '../../AppContexts';
import { SelectFile, SelectFileProps } from '../../Controls';
import { useLazyAudioContext } from '../../ReactUtils';
import { decodeFileToWav } from '../../Sounds';
import { SFC } from '../../UtilityTypes';
import { skipPromise } from '../../Utils';
import { SoundWorkshopStore, useSoundWorkshopStore } from '../Store';

const select = ({
	soundBufferManager,
}: SoundWorkshopStore) => ({
	soundBufferManager,
} as const);

export const SoundOpenFileButton: SFC = () => {
	const store = useSoundWorkshopStore(select);
	const { soundBufferManager } = store;

	const { OpenFileIcon } = useIconContext();
	const { i18n } = useLocaleContext();

	const getAudioContext = useLazyAudioContext(soundBufferManager.soundBuffer.sampleRate);

	const pushSoundFile = async (file: File): Promise<void> => {
		const audioContext = getAudioContext();
		const channels = await decodeFileToWav(audioContext, file);
		soundBufferManager.push(channels, 'file');
	};

	const openFileProps: SelectFileProps = {
		kind: 'icon',
		rounded: true,
		title: i18n.t('Workshop:open'),
		changeFile: (file) => skipPromise(pushSoundFile(file)),
	};
	return (
		<SelectFile {...openFileProps}>
			<OpenFileIcon />
		</SelectFile>
	);
};
