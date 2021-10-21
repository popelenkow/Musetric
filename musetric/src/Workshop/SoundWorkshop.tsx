import React, { useEffect, useMemo, FC } from 'react';
import { createClasses, createUseClasses } from '../AppContexts/Css';
import { SoundProgress } from './SoundProgress';
import { createSoundBuffer, createSoundCircularBuffer } from '../Sounds';
import { useSoundFile } from './SoundFile';
import { useSoundLive } from './SoundLive';
import { useSoundPlayer } from './SoundPlayer';
import { useSoundProgressBar } from './SoundProgressBar';
import { useSoundRecorder } from './SoundRecorder';
import { useSoundView } from './SoundView';

export const getSoundWorkshopClasses = createClasses((css) => {
	const { app, splitter, sidebar } = css.theme;
	return {
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
			background: app,
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
			background: app,
			'border-top': `1px solid ${splitter}`,
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
			'flex-direction': 'row',
			'justify-content': 'center',
			'column-gap': '4px',
			'align-items': 'center',
			'background-color': sidebar,
			'border-top': `1px solid ${splitter}`,
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
			'background-color': sidebar,
			'border-left': `1px solid ${splitter}`,
		},
	};
});
const useClasses = createUseClasses('SoundWorkshop', getSoundWorkshopClasses);

export const SoundWorkshop: FC = () => {
	const classes = useClasses();

	const { isLive, LiveCheckbox } = useSoundLive();

	const [sampleRate, channelCount] = useMemo(() => [48000, 2], []);
	const soundBuffer = useMemo(
		() => createSoundBuffer(sampleRate, channelCount),
		[sampleRate, channelCount],
	);
	const soundCircularBuffer = useMemo(
		() => createSoundCircularBuffer(sampleRate, channelCount),
		[sampleRate, channelCount],
	);
	const { OpenFileButton, SaveFileButton } = useSoundFile(soundBuffer);

	const { isPlaying, PlayerButton } = useSoundPlayer(soundBuffer);
	const { isRecording, initRecorder, RecorderCheckbox } = useSoundRecorder({
		soundBuffer,
		soundCircularBuffer,
	});

	useEffect(() => {
		if (isLive) initRecorder().finally(() => {});
	}, [isLive, initRecorder]);

	const { SoundView, WaveformRadio, FrequencyRadio, SpectrogramRadio } = useSoundView({
		soundBuffer,
		soundCircularBuffer,
		isLive,
	});

	const { ProgressBarView } = useSoundProgressBar(soundBuffer, soundCircularBuffer);

	return (
		<div className={classes.root}>
			<div className={classes.view}>
				<SoundView />
			</div>
			<div className={classes.progressBar}>
				<ProgressBarView />
			</div>
			<div className={classes.toolbar}>
				<PlayerButton disabled={isRecording} />
				<SoundProgress soundBuffer={soundBuffer} />
				<RecorderCheckbox disabled={isPlaying} />
			</div>
			<div className={classes.sidebar}>
				<LiveCheckbox />
				<WaveformRadio />
				<FrequencyRadio />
				<SpectrogramRadio />
				<OpenFileButton />
				<SaveFileButton />
			</div>
		</div>
	);
};
