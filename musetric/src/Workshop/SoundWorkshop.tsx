import React, { useEffect, useMemo, FC } from 'react';
import { createClasses, createUseClasses } from '../AppContexts/Css';
import { SoundProgress } from './SoundProgress';
import { createSoundBufferManager } from '../Sounds/SoundBufferManager';
import { useSoundFile } from './SoundFile';
import { useSoundLive } from './SoundLive';
import { useSoundPlayer } from './SoundPlayer';
import { useSoundProgressBar } from './SoundProgressBar';
import { useSoundRecorder } from './SoundRecorder';
import { useSoundView } from './SoundView';

export const getSoundWorkshopClasses = createClasses((css) => {
	const { app, divider: splitter, sidebar } = css.theme;
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

	const { isLive, renderLiveCheckbox } = useSoundLive();

	const [sampleRate, channelCount] = useMemo(() => [48000, 2], []);
	const soundBufferManager = useMemo(
		() => createSoundBufferManager(sampleRate, channelCount),
		[sampleRate, channelCount],
	);

	const { renderOpenFileButton, renderSaveFileButton } = useSoundFile(soundBufferManager);

	const { isPlaying, renderPlayerButton } = useSoundPlayer(soundBufferManager);
	const {
		isRecording, initRecorder, renderRecorderCheckbox,
	} = useSoundRecorder(soundBufferManager);

	useEffect(() => {
		if (isLive) initRecorder().finally(() => {});
	}, [isLive, initRecorder]);

	const {
		renderSoundView,
		renderWaveformRadio, renderFrequencyRadio, renderSpectrogramRadio,
	} = useSoundView({
		soundBufferManager,
		isLive,
	});

	const { renderProgressBarView } = useSoundProgressBar(soundBufferManager);

	return (
		<div className={classes.root}>
			<div className={classes.view}>
				{renderSoundView()}
			</div>
			<div className={classes.progressBar}>
				{renderProgressBarView()}
			</div>
			<div className={classes.toolbar}>
				{renderPlayerButton({ disabled: isRecording })}
				<SoundProgress soundBufferManager={soundBufferManager} />
				{renderRecorderCheckbox({ disabled: isPlaying })}
			</div>
			<div className={classes.sidebar}>
				{renderLiveCheckbox()}
				{renderWaveformRadio()}
				{renderFrequencyRadio()}
				{renderSpectrogramRadio()}
				{renderOpenFileButton()}
				{renderSaveFileButton()}
			</div>
		</div>
	);
};
