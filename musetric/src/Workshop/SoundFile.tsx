import React, { ReactElement } from 'react';
import { saveAs } from 'file-saver';
import { useIconContext } from '../AppContexts/Icon';
import { useLocaleContext } from '../AppContexts/Locale';
import { SoundBufferManager } from '../Sounds/SoundBufferManager';
import { Button, ButtonProps } from '../Controls/Button';
import { SelectFile, SelectFileProps } from '../Controls/SelectFile';
import { useSoundConverter } from './SoundConverter';

export type SoundFile = {
	renderSaveFileButton: () => ReactElement;
	renderOpenFileButton: () => ReactElement;
};
export const useSoundFile = (soundBufferManager: SoundBufferManager): SoundFile => {
	const { OpenFileIcon, SaveIcon } = useIconContext();
	const { t } = useLocaleContext();

	const { getBlob, pushFile } = useSoundConverter(soundBufferManager);

	const saveFile = async (name: string) => {
		const blob = await getBlob();
		saveAs(blob, name);
	};

	const pushSoundFile = async (file: File) => {
		await pushFile(file);
	};

	const renderSaveFileButton = () => {
		const saveFileProps: ButtonProps = {
			kind: 'icon',
			rounded: true,
			title: t('Workshop:save'),
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
			title: t('Workshop:open'),
			onChangeFile: pushSoundFile,
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
