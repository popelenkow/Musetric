import React, { ReactElement } from 'react';
import { useIconContext, useLocaleContext } from '../../AppContexts';
import { SoundBufferManager, decodeFileToWav } from '../../Sounds';
import { SelectFile, SelectFileProps } from '../../Controls';
import { skipPromise } from '../../Utils';
import { useLazyAudioContext } from '../../ReactUtils';

export type SoundOpenFileButtonProps = {
	soundBufferManager: SoundBufferManager,
};
export function SoundOpenFileButton(
	props: SoundOpenFileButtonProps,
): ReactElement {
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
}
