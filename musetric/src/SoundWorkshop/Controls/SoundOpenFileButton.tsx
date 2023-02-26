import React from 'react';
import { useIconContext } from '../../AppContexts/Icon';
import { useLocaleContext } from '../../AppContexts/Locale';
import { SelectFile, SelectFileProps } from '../../Controls/SelectFile';
import { decodeFileToWav } from '../../Sounds/Wav';
import { SFC } from '../../UtilityTypes/React';
import { skipPromise } from '../../Utils/SkipPromise';
import { useLazyAudioContext } from '../../UtilsReact/LazyAudioContext';
import { SoundWorkshopSnapshot, useSoundWorkshopStore } from '../SoundWorkshopContext';

const select = ({
	soundBufferManager,
}: SoundWorkshopSnapshot) => ({
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
