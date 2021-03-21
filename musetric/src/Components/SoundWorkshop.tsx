/* eslint-disable max-len */
/* eslint-disable jsx-a11y/media-has-caption */
import React, { useState, useRef } from 'react';
import { createUseStyles } from 'react-jss';
import {
	SoundBufferProvider, useSoundBuffer, Theme,
	Button, SelectFile, Radio, Checkbox, SoundProgress,
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
		overflow: 'hidden',
		display: 'grid',
		'grid-template-rows': '1fr 56px 48px',
		'grid-template-columns': '1fr 48px',
	},
	view: {
		'grid-column-start': '1',
		'grid-column-end': '2',
		'grid-row-start': '1',
		'grid-row-end': '2',
		width: '100%',
		height: '100%',
		overflow: 'hidden',
		background: theme.color.app,
		display: 'flex',
		position: 'relative',
	},
	loadBar: {
		'grid-column-start': '1',
		'grid-column-end': '2',
		'grid-row-start': '2',
		'grid-row-end': '3',
		width: '100%',
		height: 'calc(100% - 1px)',
		overflow: 'hidden',
		background: theme.color.app,
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
		'flex-direction': 'column',
		'justify-content': 'center',
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
	const { soundBuffer, player, file, recorder } = useSoundBuffer();

	type SoundViewId = 'Frequency' | 'Spectrogram' | 'Waveform';
	const [soundViewId, setSoundViewId] = useState<SoundViewId>('Waveform');

	return (
		<div className={classes.root}>
			<div className={classes.view}>
				<PerformanceMonitor ref={performanceMonitor} />
				{soundViewId === 'Waveform' && <Waveform soundBuffer={soundBuffer} performanceMonitor={performanceMonitor.current} />}
				{soundViewId === 'Frequency' && <Frequency soundBuffer={soundBuffer} performanceMonitor={performanceMonitor.current} />}
				{soundViewId === 'Spectrogram' && <Spectrogram soundBuffer={soundBuffer} performanceMonitor={performanceMonitor.current} />}
			</div>
			<div className={classes.loadBar}>
				<Waveform soundBuffer={soundBuffer} size={{ width: 600, height: 50 }} />
			</div>
			<div className={classes.toolbar}>
				<Button onClick={() => file.save('myRecording.wav')}><SaveIcon /></Button>
				<SelectFile onChangeFile={file.set}><OpenFileIcon /></SelectFile>
				<SoundProgress soundBuffer={soundBuffer} />
			</div>
			<div className={classes.sidebar}>
				{!player.isPlaying
					? <Button disabled={recorder.isRecording} onClick={() => player.start()}><PlayIcon /></Button>
					: <Button onClick={() => player.stop()}><StopIcon /></Button>}
				{!recorder.isRecording
					? <Button disabled={player.isPlaying} onClick={() => recorder.start()}><RecordIcon /></Button>
					: <Button onClick={() => recorder.stop()}><StopIcon /></Button>}
				<Checkbox disabled onToggle={() => {}}><LiveIcon /></Checkbox>
				<Radio name='soundView' value='Waveform' onSelected={setSoundViewId} checkedValue={soundViewId}><WaveformIcon /></Radio>
				<Radio name='soundView' value='Frequency' onSelected={setSoundViewId} checkedValue={soundViewId}><FrequencyIcon /></Radio>
				<Radio name='soundView' value='Spectrogram' onSelected={setSoundViewId} checkedValue={soundViewId}><SpectrogramIcon /></Radio>
			</div>
		</div>
	);
};

export type SoundWorkshopProps = {
};

export const SoundWorkshop: React.FC<SoundWorkshopProps> = () => {
	return (
		<SoundBufferProvider>
			<Root />
		</SoundBufferProvider>
	);
};
