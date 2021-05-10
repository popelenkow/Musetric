import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { saveAs } from 'file-saver';
import {
	SoundBuffer, createWavCoder,
	Button, SelectFile, SaveIcon, OpenFileIcon,
} from '..';

export const useSoundFile = (soundBuffer: SoundBuffer, setSoundBlob: (blob: Blob) => void) => {
	const [audioContextState, setAudioContext] = useState<AudioContext>();
	const getAudioContext = () => {
		const { sampleRate } = soundBuffer;
		let audioContext = audioContextState;
		if (!audioContext) {
			audioContext = new AudioContext({ sampleRate });
			setAudioContext(audioContext);
		}

		const audioBufferSource = audioContext.createBufferSource();
		audioBufferSource.buffer;
		return audioContext;
	};
	const wavCoder = useMemo(() => createWavCoder(), []);

	const getBlob = useCallback(async (): Promise<Blob> => {
		const { buffers, sampleRate } = soundBuffer;
		const blob = await wavCoder.encode({ buffers, sampleRate });
		return blob;
	}, [soundBuffer, wavCoder]);

	useEffect(() => {
		getBlob().then(blob => {
			setSoundBlob(blob);
		}).finally(() => {});
	}, [getBlob, setSoundBlob]);

	const saveFile = async (name: string) => {
		const blob = await getBlob();
		saveAs(blob, name);
	};

	const setFile = async (file: File) => {
		const audioContext = getAudioContext();
		const arrayBuffer = await file.arrayBuffer();
		const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
		const buffers: Float32Array[] = [];
		for (let i = 0; i < soundBuffer.channelCount; i++) {
			buffers[i] = audioBuffer.getChannelData(i);
		}
		soundBuffer.push(buffers);
		const blob = await getBlob();
		setSoundBlob(blob);
	};

	const saveFileButton = <Button onClick={() => saveFile('myRecording.wav')}><SaveIcon /></Button>;
	const openFileButton = <SelectFile onChangeFile={setFile}><OpenFileIcon /></SelectFile>;

	return {
		getBlob,
		saveFileButton,
		openFileButton,
	};
};
