import React, { useEffect, useState, FC } from 'react';
import { saveAs } from 'file-saver';
import { useIconContext } from '../AppContexts/Icon';
import { SoundBuffer } from '../Sounds/SoundBuffer';
import { Button } from '../Controls/Button';
import { SelectFile } from '../Controls/SelectFile';
import { useSoundConverter } from './SoundConverter';

export const useSoundFile = (soundBuffer: SoundBuffer) => {
	const { OpenFileIcon, SaveIcon } = useIconContext();
	const [soundBlob, setSoundBlob] = useState<Blob>();

	const { getBlob, pushFile } = useSoundConverter(soundBuffer);

	useEffect(() => {
		getBlob().then(blob => {
			setSoundBlob(blob);
		}).finally(() => {});
	}, [getBlob, soundBuffer, setSoundBlob]);

	const saveFile = async (name: string) => {
		const blob = await getBlob();
		saveAs(blob, name);
	};

	const pushSoundFile = async (file: File) => {
		await pushFile(file);
		const blob = await getBlob();
		setSoundBlob(blob);
	};

	const SaveFileButton: FC = () => <Button onClick={() => saveFile('myRecording.wav')}><SaveIcon /></Button>;
	const OpenFileButton: FC = () => (
		<SelectFile onChangeFile={pushSoundFile}>
			<OpenFileIcon />
		</SelectFile>
	);

	const refreshSound = async () => {
		const blob = await getBlob();
		setSoundBlob(blob);
	};

	return {
		soundBlob,
		refreshSound,
		SaveFileButton,
		OpenFileButton,
	};
};
