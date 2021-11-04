import React, { ReactElement } from 'react';
import { saveAs } from 'file-saver';
import { useIconContext } from '../AppContexts/Icon';
import { SoundBufferManager } from '../Sounds/SoundBufferManager';
import { Button } from '../Controls/Button';
import { SelectFile } from '../Controls/SelectFile';
import { useSoundConverter } from './SoundConverter';

export type SoundFile = {
	renderSaveFileButton: () => ReactElement;
	renderOpenFileButton: () => ReactElement;
};
export const useSoundFile = (soundBufferManager: SoundBufferManager): SoundFile => {
	const { OpenFileIcon, SaveIcon } = useIconContext();

	const { getBlob, pushFile } = useSoundConverter(soundBufferManager);

	const saveFile = async (name: string) => {
		const blob = await getBlob();
		saveAs(blob, name);
	};

	const pushSoundFile = async (file: File) => {
		await pushFile(file);
	};

	return {
		renderSaveFileButton: () => (
			<Button kind='icon' onClick={() => saveFile('myRecording.wav')} rounded>
				<SaveIcon />
			</Button>
		),
		renderOpenFileButton: () => (
			<SelectFile onChangeFile={pushSoundFile} rounded>
				<OpenFileIcon />
			</SelectFile>
		),
	};
};
