import React, { useEffect, useMemo, FC } from 'react';
import { Css, createUseClasses } from '../AppContexts/Css';
import { SoundProgress } from './SoundProgress';
import { createSoundBuffer, createSoundCircularBuffer } from '../Sounds';
import { useSoundFile } from './SoundFile';
import { useSoundLive } from './SoundLive';
import { useSoundPlayer } from './SoundPlayer';
import { useSoundProgressBar } from './SoundProgressBar';
import { useSoundRecorder } from './SoundRecorder';
import { useSoundView } from './SoundView';

export const getSoundWorkshopClasses = (css: Css) => ({
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

export const SoundWorkshop: FC<SoundWorkshopProps> = () => {
	const classes = useSoundWorkshopClasses();

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
	const { soundBlob, refreshSound, OpenFileButton, SaveFileButton } = useSoundFile(soundBuffer);

	const { isPlaying, PlayerButton } = useSoundPlayer(soundBuffer, soundBlob);
	const { isRecording, initRecorder, RecorderCheckbox } = useSoundRecorder({
		soundBuffer,
		soundCircularBuffer,
		refreshSound,
	});

	useEffect(() => {
		isLive && initRecorder();
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
				<SaveFileButton />
				<OpenFileButton />
				<SoundProgress soundBuffer={soundBuffer} />
			</div>
			<div className={classes.sidebar}>
				<PlayerButton disabled={isRecording} />
				<RecorderCheckbox disabled={isPlaying} />
				<LiveCheckbox />
				<WaveformRadio />
				<FrequencyRadio />
				<SpectrogramRadio />
			</div>
		</div>
	);
};
