import React from 'react';
import { useAppLocale } from '../../App/AppContext';
import { Icon } from '../../Controls/Icon';
import { SelectFile, SelectFileProps } from '../../Controls/SelectFile';
import { decodeArrayBufferToWav } from '../../Sounds/Wav';
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

	const { i18n } = useAppLocale();

	const getAudioContext = useLazyAudioContext(soundBufferManager.soundBuffer.sampleRate);

	const pushSoundFile = async (file: File): Promise<void> => {
		const audioContext = getAudioContext();
		const data = await file.arrayBuffer();
		const channels = await decodeArrayBufferToWav(audioContext, data);
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
			<Icon name='openFile' />
		</SelectFile>
	);
};
