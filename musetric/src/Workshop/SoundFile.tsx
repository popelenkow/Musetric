import React, { ReactElement } from 'react';
import { useIconContext } from '../AppContexts/Icon';
import { useLocaleContext } from '../AppContexts/Locale';
import { SoundBufferManager } from '../Sounds/SoundBufferManager';
import { Button, ButtonProps } from '../Controls/Button';
import { SelectFile, SelectFileProps } from '../Controls/SelectFile';
import { useSoundConverter } from './SoundConverter';
import { skipPromise } from '../Utils/SkipPromise';
import { saveBlobFile } from '../Utils/SaveBlobFile';

export type SoundFile = {
	renderSaveFileButton: () => ReactElement;
	renderOpenFileButton: () => ReactElement;
};
export const useSoundFile = (soundBufferManager: SoundBufferManager): SoundFile => {
	const { OpenFileIcon, SaveIcon } = useIconContext();
	const { i18n } = useLocaleContext();

	const { getBlob, pushFile } = useSoundConverter(soundBufferManager);

	const saveFile = (name: string) => {
		const blob = getBlob();
		saveBlobFile(blob, name);
	};

	const pushSoundFile = async (file: File) => {
		await pushFile(file);
	};

	const renderSaveFileButton = () => {
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
	const renderOpenFileButton = () => {
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

	return {
		renderSaveFileButton,
		renderOpenFileButton,
	};
};
