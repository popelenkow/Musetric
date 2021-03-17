/* eslint-disable max-len */
/* eslint-disable jsx-a11y/media-has-caption */
import React, { useContext, useMemo, useState, useRef } from 'react';
import { createUseStyles } from 'react-jss';
import {
	SoundBufferProvider, RecorderProvider,
	SoundBufferContext, RecorderContext, Theme,
	Button, SelectFile, Radio, Checkbox,
	Frequency, Waveform, Spectrogram,
	RecordIcon, SaveIcon, FrequencyIcon, OpenFileIcon,
	WaveformIcon, SpectrogramIcon, StopIcon, PlayIcon, LiveIcon,
	PerformanceMonitor, PerformanceMonitorRef,
} from '..';
import { theming } from '../Contexts';

export const getSoundWorkshopStyles = (theme: Theme) => ({
	root: {
		width: '100%',
		height: '100%',
		display: 'grid',
		'grid-template-rows': '1fr 56px 48px',
		'grid-template-columns': '1fr 48px',
	},
	view: {
		'grid-column-start': '1',
		'grid-column-end': '2',
		'grid-row-start': '1',
		'grid-row-end': '2',
		position: 'relative',
		overflow: 'hidden',
		width: '100%',
		height: '100%',
	},
	loadBar: {
		'grid-column-start': '1',
		'grid-column-end': '2',
		'grid-row-start': '2',
		'grid-row-end': '3',
		overflow: 'hidden',
		width: '100%',
		height: 'calc(100% - 1px)',
		'border-top': `1px solid ${theme.color.splitter}`,
	},
	toolbar: {
		'grid-column-start': '1',
		'grid-column-end': '3',
		'grid-row-start': '3',
		width: '100%',
		height: '48px',
		display: 'flex',
		'flex-direction': 'row-reverse',
		'column-gap': '4px',
		'align-items': 'center',
		'background-color': theme.color.sidebar,
		'border-top': `1px solid ${theme.color.splitter}`,
	},
	sidebar: {
		'grid-column-start': '2',
		'grid-column-end': '3',
		'grid-row-start': '1',
		'grid-row-end': '3',
		width: '48px',
		height: '100%',
		display: 'flex',
		'flex-direction': 'column-reverse',
		'row-gap': '4px',
		'align-items': 'center',
		'background-color': theme.color.sidebar,
		'border-left': `1px solid ${theme.color.splitter}`,
	},
});

export const useSoundWorkshopStyles = createUseStyles(getSoundWorkshopStyles, { name: 'SoundWorkshop', theming });

type RootProps = {
};

const Root: React.FC<RootProps> = () => {
	const classes = useSoundWorkshopStyles();

	const performanceMonitor = useRef<PerformanceMonitorRef>(null);
	const [isPlaying, setIsPlaying] = useState<boolean>(false);
	const { setFile, soundBuffer, saveFile, soundBlob } = useContext(SoundBufferContext);
	const { startRecord, stopRecord, isRecording, recorder } = useContext(RecorderContext);

	type SoundViewId = 'Frequency' | 'Spectrogram' | 'Waveform';
	const [soundViewId, setSoundViewId] = useState<SoundViewId>('Waveform');
	const url = useMemo(() => (soundBlob ? URL.createObjectURL(soundBlob) : undefined), [soundBlob]);

	return (
		<div className={classes.root}>
			<div className={classes.view}>
				<PerformanceMonitor ref={performanceMonitor} />
				{soundViewId === 'Waveform' && <Waveform soundBuffer={soundBuffer} performanceMonitor={performanceMonitor.current} />}
				{soundViewId === 'Frequency' && recorder && <Frequency recorder={recorder} performanceMonitor={performanceMonitor.current} />}
				{soundViewId === 'Spectrogram' && <Spectrogram soundBuffer={soundBuffer} performanceMonitor={performanceMonitor.current} />}
			</div>
			<div className={classes.loadBar}>
				{url && <audio className='recorder-item' key={url} controls src={url} />}
			</div>
			<div className={classes.toolbar}>
				{!isRecording
					? <Button disabled={isPlaying} onClick={() => startRecord()}><RecordIcon /></Button>
					: <Button onClick={() => stopRecord()}><StopIcon /></Button>}
				{!isPlaying
					? <Button disabled={isRecording || true} onClick={() => setIsPlaying(true)}><PlayIcon /></Button>
					: <Button onClick={() => setIsPlaying(false)}><StopIcon /></Button>}
			</div>
			<div className={classes.sidebar}>
				<Checkbox disabled onToggle={() => {}}><LiveIcon /></Checkbox>
				<Radio name='soundView' value='Waveform' onSelected={setSoundViewId} checkedValue={soundViewId}><WaveformIcon /></Radio>
				<Radio name='soundView' value='Frequency' onSelected={setSoundViewId} checkedValue={soundViewId}><FrequencyIcon /></Radio>
				<Radio name='soundView' value='Spectrogram' onSelected={setSoundViewId} checkedValue={soundViewId}><SpectrogramIcon /></Radio>
				<SelectFile onChangeFile={setFile}><OpenFileIcon /></SelectFile>
				<Button onClick={() => saveFile('myRecording.wav')}><SaveIcon /></Button>
			</div>
		</div>
	);
};

export type SoundWorkshopProps = {
};

export const SoundWorkshop: React.FC<SoundWorkshopProps> = () => {
	return (
		<SoundBufferProvider>
			<RecorderProvider>
				<Root />
			</RecorderProvider>
		</SoundBufferProvider>
	);
};
