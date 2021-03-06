import React, { useEffect, useRef, useMemo } from 'react';
import {
	AppCss, createUseClasses,
	useSoundRecorder, useSoundPlayer, useSoundLive,
	useSoundView, useSoundProgressBar, useSoundFile,
	SoundProgress,
	PerformanceMonitor, PerformanceMonitorRef,
	createSoundBuffer, createSoundCircularBuffer,
} from '..';

export const getSoundWorkshopClasses = (css: AppCss) => ({
	root: {
		width: '100%',
		height: '100%',
		overflow: 'hidden',
		display: 'grid',
		'grid-template-rows': '1fr  56px 48px',
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
		background: css.theme.app,
		display: 'flex',
		position: 'relative',
	},
	progressBar: {
		'grid-column-start': '1',
		'grid-column-end': '2',
		'grid-row-start': '2',
		'grid-row-end': '3',
		'box-sizing': 'border-box',
		width: '100%',
		height: '100%',
		overflow: 'hidden',
		background: css.theme.app,
		'border-top': `1px solid ${css.theme.splitter}`,
	},
	toolbar: {
		'grid-column-start': '1',
		'grid-column-end': '2',
		'grid-row-start': '3',
		'grid-row-end': '4',
		'box-sizing': 'border-box',
		width: '100%',
		height: '100%',
		padding: '3px',
		display: 'flex',
		'flex-direction': 'row-reverse',
		'column-gap': '4px',
		'align-items': 'center',
		'background-color': css.theme.sidebar,
		'border-top': `1px solid ${css.theme.splitter}`,
	},
	sidebar: {
		'grid-column-start': '2',
		'grid-column-end': '3',
		'grid-row-start': '1',
		'grid-row-end': '4',
		'box-sizing': 'border-box',
		width: '100%',
		height: '100%',
		padding: '3px',
		display: 'flex',
		'flex-direction': 'column',
		'justify-content': 'center',
		'row-gap': '4px',
		'align-items': 'center',
		'background-color': css.theme.sidebar,
		'border-left': `1px solid ${css.theme.splitter}`,
	},
});

export const useSoundWorkshopClasses = createUseClasses('SoundWorkshop', getSoundWorkshopClasses);

export type SoundWorkshopProps = {
};

export const SoundWorkshop: React.FC<SoundWorkshopProps> = () => {
	const classes = useSoundWorkshopClasses();

	const { isLive, liveCheckbox } = useSoundLive();
	const performanceMonitor = useRef<PerformanceMonitorRef>(null);

	const [sampleRate, channelCount] = useMemo(() => [48000, 2], []);
	const soundBuffer = useMemo(
		() => createSoundBuffer(sampleRate, channelCount),
		[sampleRate, channelCount],
	);
	const soundCircularBuffer = useMemo(
		() => createSoundCircularBuffer(sampleRate, channelCount),
		[sampleRate, channelCount],
	);
	const { soundBlob, refreshSound, openFileButton, saveFileButton } = useSoundFile(soundBuffer);

	const { isPlaying, getPlayerButton } = useSoundPlayer(soundBuffer, soundBlob);
	const { isRecording, getRecorderCheckbox, initRecorder } = useSoundRecorder({
		soundBuffer,
		soundCircularBuffer,
		refreshSound,
	});

	useEffect(() => {
		isLive && initRecorder();
	}, [isLive, initRecorder]);

	const { soundView, waveformRadio, frequencyRadio, spectrogramRadio } = useSoundView({
		soundBuffer,
		soundCircularBuffer,
		isLive,
		performanceMonitor: performanceMonitor.current,
	});

	const { progressBarView } = useSoundProgressBar(soundBuffer, soundCircularBuffer);

	return (
		<div className={classes.root}>
			<div className={classes.view}>
				<PerformanceMonitor ref={performanceMonitor} />
				{soundView}
			</div>
			<div className={classes.progressBar}>
				{progressBarView}
			</div>
			<div className={classes.toolbar}>
				{saveFileButton}
				{openFileButton}
				<SoundProgress soundBuffer={soundBuffer} />
			</div>
			<div className={classes.sidebar}>
				{getPlayerButton(isRecording)}
				{getRecorderCheckbox(isPlaying)}
				{liveCheckbox}
				{waveformRadio}
				{frequencyRadio}
				{spectrogramRadio}
			</div>
		</div>
	);
};
