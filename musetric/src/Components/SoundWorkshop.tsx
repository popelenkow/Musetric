/* eslint-disable max-len */
/* eslint-disable jsx-a11y/media-has-caption */
import React, { useContext, useMemo, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { saveAs } from 'file-saver';
import {
	SoundDeviceProvider, RecorderProvider,
	SoundDeviceContext, RecorderContext, Theme,
	Button, SelectFile, Radio, Checkbox,
	Frequency, Waveform, Spectrogram,
	RecordIcon, SaveIcon, FrequencyIcon, OpenFileIcon,
	WaveformIcon, SpectrogramIcon, StopIcon, PlayIcon, LiveIcon,
} from '..';
import { theming } from '../Contexts';

export const getSoundWorkshopStyles = (theme: Theme) => ({
	root: {
		width: '100%',
		height: '100%',
		display: 'grid',
		gridTemplateRows: '48px 56px 1fr',
		gridTemplateColumns: '1fr',
	},
	toolbar: {
		width: '100%',
		height: '48px',
		display: 'flex',
		flexDirection: 'row',
		'column-gap': '4px',
		'align-items': 'center',
		backgroundColor: theme.color.sidebar,
		borderBottom: `1px solid ${theme.color.splitter}`,
	},
	loadBar: {
		overflow: 'hidden',
		width: '100%',
		height: 'calc(100% - 1px)',
		'border-bottom': `1px solid ${theme.color.splitter}`,
	},
	view: {
		overflow: 'hidden',
		width: '100%',
		height: '100%',
	},
});

export const useSoundWorkshopStyles = createUseStyles(getSoundWorkshopStyles, { name: 'SoundWorkshop', theming });

type RootProps = {
};

const Root: React.FC<RootProps> = () => {
	const classes = useSoundWorkshopStyles();

	const [isPlaying, setIsPlaying] = useState<boolean>(false);
	const { setFile, soundBuffer } = useContext(SoundDeviceContext);
	const { startRecord, stopRecord, isRecording, recorder } = useContext(RecorderContext);

	type SoundViewId = 'Frequency' | 'Spectrogram' | 'Waveform';
	const [soundViewId, setSoundViewId] = useState<SoundViewId>('Waveform');
	const [blob, setBlob] = useState<Blob>();
	const url = useMemo(() => (blob ? URL.createObjectURL(blob) : undefined), [blob]);

	const saveAudio = () => {
		if (!blob) return;
		saveAs(blob, 'myRecording.wav');
	};

	const stop = async () => {
		const b = await stopRecord();
		setBlob(b);
	};

	const openFile = async (file: File) => {
		const b = await setFile(file);
		setBlob(b);
	};

	return (
		<div className={classes.root}>
			<div className={classes.toolbar}>
				{isPlaying
					? <Button onClick={() => setIsPlaying(false)}><StopIcon /></Button>
					: <Button disabled onClick={() => setIsPlaying(true)}><PlayIcon /></Button>}
				<Checkbox checked={isRecording} onToggle={() => (isRecording ? stop() : startRecord())}><RecordIcon /></Checkbox>
				<Radio name='soundView' value='Waveform' onSelected={setSoundViewId} checkedValue={soundViewId}><WaveformIcon /></Radio>
				<Radio name='soundView' value='Frequency' onSelected={setSoundViewId} checkedValue={soundViewId}><FrequencyIcon /></Radio>
				<Radio name='soundView' value='Spectrogram' onSelected={setSoundViewId} checkedValue={soundViewId}><SpectrogramIcon /></Radio>
				<Checkbox disabled onToggle={() => {}}><LiveIcon /></Checkbox>
				<SelectFile onChangeFile={openFile}><OpenFileIcon /></SelectFile>
				<Button onClick={saveAudio}><SaveIcon /></Button>
			</div>
			<div className={classes.loadBar}>
				{url && <audio className='recorder-item' key={url} controls src={url} />}
			</div>
			<div className={classes.view}>
				{soundViewId === 'Waveform' && soundBuffer && <Waveform soundBuffer={soundBuffer} />}
				{soundViewId === 'Frequency' && recorder && <Frequency recorder={recorder} />}
				{soundViewId === 'Spectrogram' && soundBuffer && <Spectrogram soundBuffer={soundBuffer} />}
			</div>
		</div>
	);
};

export type SoundWorkshopProps = {
};

export const SoundWorkshop: React.FC<SoundWorkshopProps> = () => {
	return (
		<SoundDeviceProvider>
			<RecorderProvider>
				<Root />
			</RecorderProvider>
		</SoundDeviceProvider>
	);
};
