import React, { useEffect, useMemo, FC } from 'react';
import className from 'classnames';
import { createClasses, createUseClasses } from '../AppContexts/Css';
import { useRootElementContext } from '../AppContexts/RootElement';
import { createSoundBufferManager } from '../Sounds/SoundBufferManager';
import { SoundProgress } from './SoundProgress';
import { useSoundFile } from './SoundFile';
import { useSoundLive } from './SoundLive';
import { useSoundPlayer } from './SoundPlayer';
import { useSoundProgressBar } from './SoundProgressBar';
import { useSoundRecorder } from './SoundRecorder';
import { useSoundView } from './SoundView';
import { useSoundParameters } from './SoundParameters';
import { skipPromise } from '../Utils/SkipPromise';

export const getSoundWorkshopClasses = createClasses((css) => {
	const { theme } = css;
	return {
		root: {
			display: 'grid',
			overflow: 'hidden',
			'&.default': {
				'grid-template-rows': '1fr 56px 50px',
				'grid-template-columns': '1fr 50px',
				'grid-template-areas': `
					"view sidebar"
					"progressBar sidebar"
					"toolbar sidebar"
				`,
			},
			'&.withParameters': {
				'grid-template-rows': '1fr 1fr 56px 50px',
				'grid-template-columns': '1fr 50px',
				'grid-template-areas': `
					"parameters sidebar"
					"view sidebar"
					"progressBar sidebar"
					"toolbar sidebar"
				`,
			},
		},
		view: {
			'grid-area': 'view',
			overflow: 'hidden',
			'background-color': theme.background,
			display: 'flex',
			position: 'relative',
		},
		progressBar: {
			'grid-area': 'progressBar',
			'box-sizing': 'border-box',
			overflow: 'hidden',
			'background-color': theme.background,
			'border-top': `1px solid ${theme.divider}`,
		},
		toolbar: {
			'grid-area': 'toolbar',
			'box-sizing': 'border-box',
			padding: '0px 4px',
			display: 'flex',
			'flex-direction': 'row',
			'justify-content': 'center',
			'align-items': 'center',
			'column-gap': '4px',
			'background-color': theme.activeBackground,
			'border-top': `1px solid ${theme.divider}`,
		},
		sidebar: {
			'grid-area': 'sidebar',
			'box-sizing': 'border-box',
			padding: '4px 0px',
			display: 'flex',
			'flex-direction': 'column',
			'justify-content': 'center',
			'align-items': 'center',
			'row-gap': '4px',
			'background-color': theme.activeBackground,
			'border-left': `1px solid ${theme.divider}`,
		},
		sidebarTop: {
			display: 'flex',
			'flex-direction': 'column',
		},
		sidebarMiddle: {
			height: '100%',
			display: 'flex',
			'flex-direction': 'column',
			'justify-content': 'center',
		},
	};
});
const useClasses = createUseClasses('SoundWorkshop', getSoundWorkshopClasses);

export const SoundWorkshop: FC = () => {
	const classes = useClasses();

	const { isLive, renderLiveButton } = useSoundLive();

	const [sampleRate, channelCount] = useMemo(() => [48000, 2], []);
	const soundBufferManager = useMemo(
		() => createSoundBufferManager(sampleRate, channelCount),
		[sampleRate, channelCount],
	);

	const { renderOpenFileButton, renderSaveFileButton } = useSoundFile(soundBufferManager);

	const { isPlaying, renderPlayerButton } = useSoundPlayer(soundBufferManager);
	const {
		isRecording, initRecorder, renderRecorderButton,
	} = useSoundRecorder(soundBufferManager);

	useEffect(() => {
		if (isLive) skipPromise(initRecorder());
	}, [isLive, initRecorder]);

	const { rootElement } = useRootElementContext();
	const soundParameters = useSoundParameters({
		element: rootElement,
		soundBufferManager,
	});
	const {
		isOpenParameters,
		renderParametersButton,
		renderParametersPanel,
	} = soundParameters;
	const {
		renderSoundView,
		renderWaveformButton, renderFrequencyButton, renderSpectrogramButton,
	} = useSoundView({
		soundBufferManager,
		soundParameters,
		isLive,
	});

	const { renderProgressBarView } = useSoundProgressBar(soundBufferManager);

	const getRootStateName = () => {
		if (isOpenParameters) return 'withParameters';
		return 'default';
	};
	const rootName = className({
		[classes.root]: true,
		[getRootStateName()]: true,
	});

	return (
		<div className={rootName}>
			{isOpenParameters && renderParametersPanel()}
			<div className={classes.view}>
				{renderSoundView()}
			</div>
			<div className={classes.progressBar}>
				{renderProgressBarView()}
			</div>
			<div className={classes.toolbar}>
				{renderPlayerButton({ disabled: isRecording })}
				<SoundProgress soundBufferManager={soundBufferManager} />
				{renderRecorderButton({ disabled: isPlaying })}
			</div>
			<div className={classes.sidebar}>
				<div className={classes.sidebarTop}>
					{renderParametersButton()}
				</div>
				<div className={classes.sidebarMiddle}>
					{renderLiveButton()}
					{renderWaveformButton()}
					{renderFrequencyButton()}
					{renderSpectrogramButton()}
					{renderOpenFileButton()}
					{renderSaveFileButton()}
				</div>
			</div>
		</div>
	);
};
