import React, { FC } from 'react';
import { useIconContext } from '../../AppContexts/Icon';
import { useLocaleContext } from '../../AppContexts/Locale';
import { SoundBufferManager } from '../../Sounds/SoundBufferManager';
import { SelectFile, SelectFileProps } from '../../Controls/SelectFile';
import { skipPromise } from '../../Utils/SkipPromise';
import { useLazyAudioContext } from '../../ReactUtils';
import { decodeFileToWav } from '../../Sounds';

export type SoundOpenFileButtonProps = {
	soundBufferManager: SoundBufferManager;
};
export const SoundOpenFileButton: FC<SoundOpenFileButtonProps> = (props) => {
	const { soundBufferManager } = props;

	const { OpenFileIcon } = useIconContext();
	const { i18n } = useLocaleContext();

	const getAudioContext = useLazyAudioContext(soundBufferManager.soundBuffer.sampleRate);

	const pushSoundFile = async (file: File) => {
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
