import React, { FC } from 'react';
import { saveAs } from 'file-saver';
import { useIconContext } from '../AppContexts/Icon';
import { SoundBuffer } from '../Sounds/SoundBuffer';
import { Button } from '../Controls/Button';
import { SelectFile } from '../Controls/SelectFile';
import { useSoundConverter } from './SoundConverter';

export type SoundFile = {
	SaveFileButton: FC;
	OpenFileButton: FC;
};
export const useSoundFile = (soundBuffer: SoundBuffer): SoundFile => {
	const { OpenFileIcon, SaveIcon } = useIconContext();

	const { getBlob, pushFile } = useSoundConverter(soundBuffer);

	const saveFile = async (name: string) => {
		const blob = await getBlob();
		saveAs(blob, name);
	};

	const pushSoundFile = async (file: File) => {
		await pushFile(file);
	};

	const SaveFileButton: FC = () => <Button onClick={() => saveFile('myRecording.wav')}><SaveIcon /></Button>;
	const OpenFileButton: FC = () => (
		<SelectFile onChangeFile={pushSoundFile}>
			<OpenFileIcon />
		</SelectFile>
	);

	return {
		SaveFileButton,
		OpenFileButton,
	};
};
