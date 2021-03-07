/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useMemo, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { saveAs } from 'file-saver';
import {
	RecorderDevice, createRecorderDevice,
	Theme, getButtonStyles,
	Switch, SwitchProps, Button, SelectFile,
	Frequency, Waveform, Spectrogram,
	RecordIcon, SaveIcon, FrequencyIcon, OpenFileIcon, WaveformIcon, SpectrogramIcon, StopIcon,
} from '..';
import { theming } from '../Contexts';

export const getSoundWorkshopStyles = (theme: Theme) => ({
	root: {
		width: '100%',
		height: '100%',
		display: 'grid',
		gridTemplateRows: '40px 1fr',
		gridTemplateColumns: '1fr',
	},
	toolbar: {
		width: '100%',
		height: '40px',
		display: 'flex',
		flexDirection: 'row',
		backgroundColor: theme.color.sidebarBg,
		borderBottom: `1px solid ${theme.color.splitter}`,
	},
	toolbarButton: {
		...getButtonStyles(theme).root,
		width: '40px',
		height: '40px',
		padding: '0',
	},
	content: {
		display: 'grid',
		gridTemplateRows: '56px 1fr',
		gridTemplateColumns: '1fr',
		gap: '5px',
		padding: '5px',
		overflow: 'hidden',
	},
	contentView: {
		overflow: 'hidden',
		width: '100%',
		height: '100%',
		border: `1px solid ${theme.color.splitter}`,
	},
});

export const useSoundWorkshopStyles = createUseStyles(getSoundWorkshopStyles, { name: 'SoundWorkshop', theming });

export type RecorderProps = {
	recorderDevice: RecorderDevice;
	drop: () => void;
};

export const RecorderView: React.FC<RecorderProps> = (props) => {
	const { recorderDevice } = props;
	const classes = useSoundWorkshopStyles();

	const { audioContext, recorder, wavCoder, soundBuffer } = recorderDevice;

	const [isRecording, setIsRecording] = useState<boolean>(false);

	type ContentId = 'Frequency' | 'Spectrogram' | 'Waveform';
	const [contentId, setContentId] = useState<ContentId>('Waveform');
	const [blob, setBlob] = useState<Blob>();
	const url = useMemo(() => (blob ? URL.createObjectURL(blob) : undefined), [blob]);
	const audioState = useMemo<{ audioData?: Float32Array }>(() => ({}), []);

	useEffect(() => {
		setInterval(() => {
			const result = soundBuffer.buffers[0];
			audioState.audioData = result;
		}, 100);
	}, [soundBuffer, audioState]);

	const saveAudio = () => {
		if (!blob) return;
		saveAs(blob, 'myRecording.wav');
	};

	const start = async () => {
		setBlob(undefined);
		await recorder.start();
		setIsRecording(true);
	};

	const stop = async () => {
		await recorder.stop();
		const { buffers, sampleRate } = soundBuffer;
		const b = await wavCoder.encode({ buffers, sampleRate });
		setBlob(b);
		setIsRecording(false);
	};

	const openFile = async (input: React.ChangeEvent<HTMLInputElement>) => {
		const file = input.target.files?.item(0);
		if (!file) return;
		const arrayBuffer = await file.arrayBuffer();
		const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
		const arr: Float32Array[] = [];
		for (let i = 0; i < soundBuffer.channelCount; i++) {
			arr[i] = audioBuffer.getChannelData(i);
		}
		soundBuffer.push(arr);
	};

	const switchContentProps: SwitchProps<ContentId> = {
		currentId: contentId,
		ids: ['Waveform', 'Frequency', 'Spectrogram'],
		set: (id) => setContentId(id),
		view: (id) => {
			switch (id) {
				case 'Waveform': return <WaveformIcon />;
				case 'Frequency': return <FrequencyIcon />;
				case 'Spectrogram': return <SpectrogramIcon />;
				default: return id;
			}
		},
	};

	return (
		<div className={classes.root}>
			<div id='controls' className={classes.toolbar}>
				{isRecording
					? <Button className={classes.toolbarButton} onClick={stop}><StopIcon /></Button>
					: <Button className={classes.toolbarButton} onClick={start}><RecordIcon /></Button>}
				<Switch className={classes.toolbarButton} {...switchContentProps} />
				<SelectFile className={classes.toolbarButton} onChange={openFile}>
					<OpenFileIcon />
				</SelectFile>
				<Button className={classes.toolbarButton} onClick={saveAudio}><SaveIcon /></Button>
			</div>
			<div className={classes.content}>
				<div className={classes.contentView}>
					{url && <audio className='recorder-item' key={url} controls src={url} />}
				</div>
				<div className={classes.contentView}>
					{contentId === 'Waveform' && <Waveform soundBuffer={soundBuffer} />}
					{contentId === 'Frequency' && <Frequency recorderDevice={recorderDevice} />}
					{contentId === 'Spectrogram' && <Spectrogram soundBuffer={soundBuffer} />}
				</div>
			</div>
		</div>
	);
};

export type SoundWorkshopProps = {
};

export const SoundWorkshop: React.FC<SoundWorkshopProps> = () => {
	const [recorderDevice, setRecorderDevice] = useState<RecorderDevice>();

	const init = async () => {
		const value = await createRecorderDevice();
		setRecorderDevice(value);
	};

	return (recorderDevice
		? <RecorderView recorderDevice={recorderDevice} drop={() => setRecorderDevice(undefined)} />
		: <Button style={{ width: '100%', height: '100%' }} onClick={init}>init</Button>
	);
};
