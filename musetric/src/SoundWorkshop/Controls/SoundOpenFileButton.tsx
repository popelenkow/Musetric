import React from 'react';
import { useIconContext, useLocaleContext } from '../../AppContexts';
import { SelectFile, SelectFileProps } from '../../Controls';
import { useLazyAudioContext } from '../../ReactUtils';
import { SoundBufferManager, decodeFileToWav } from '../../Sounds';
import { SFC } from '../../UtilityTypes';
import { skipPromise } from '../../Utils';

export type SoundOpenFileButtonProps = {
	soundBufferManager: SoundBufferManager,
};
export const SoundOpenFileButton: SFC<SoundOpenFileButtonProps> = (props) => {
	const { soundBufferManager } = props;

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
