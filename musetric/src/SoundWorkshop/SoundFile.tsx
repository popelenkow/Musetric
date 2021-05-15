import React, { useEffect, useState } from 'react';
import { saveAs } from 'file-saver';
import {
	SoundBuffer, useSoundConverter,
	Button, SelectFile, SaveIcon, OpenFileIcon,
} from '..';

export const useSoundFile = (soundBuffer: SoundBuffer) => {
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

	const saveFileButton = <Button onClick={() => saveFile('myRecording.wav')}><SaveIcon /></Button>;
	const openFileButton = <SelectFile onChangeFile={pushSoundFile}><OpenFileIcon /></SelectFile>;

	const refreshSound = async () => {
		const blob = await getBlob();
		setSoundBlob(blob);
	};

	return {
		soundBlob,
		refreshSound,
		saveFileButton,
		openFileButton,
	};
};
