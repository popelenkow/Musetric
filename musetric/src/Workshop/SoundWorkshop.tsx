import React, { useEffect, useMemo, FC } from 'react';
import className from 'classnames';
import { createClasses, createUseClasses } from '../AppContexts/Css';
import { createSoundBufferManager } from '../Sounds/SoundBufferManager';
import { SoundProgress } from './SoundProgress';
import { useSoundPlayer } from './SoundPlayer';
import { useSoundProgressBar } from './SoundProgressBar';
import { useSoundRecorder } from './SoundRecorder';
import { useSoundView } from './SoundView';
import { useSoundParameters } from './SoundParameters';
import { skipPromise } from '../Utils/SkipPromise';
import { SoundWorkshopProvider, useSoundWorkshopContext } from './SoundWorkshopContext';
import { SoundWorkshopSidebar } from './SoundWorkshopSidebar';

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
			'&.withTopPanel': {
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
	};
});
const useClasses = createUseClasses('SoundWorkshop', getSoundWorkshopClasses);

export const SoundWorkshopMarkup: FC = () => {
	const classes = useClasses();

	const [state] = useSoundWorkshopContext();
	const { isLive, isOpenParameters } = state;

	const [sampleRate, channelCount] = useMemo(() => [48000, 2], []);
	const soundBufferManager = useMemo(
		() => createSoundBufferManager(sampleRate, channelCount),
		[sampleRate, channelCount],
	);

	const { isPlaying, renderPlayerButton } = useSoundPlayer(soundBufferManager);
	const {
		isRecording, initRecorder, renderRecorderButton,
	} = useSoundRecorder(soundBufferManager);

	useEffect(() => {
		if (isLive) skipPromise(initRecorder());
	}, [isLive, initRecorder]);

	const soundParameters = useSoundParameters(soundBufferManager.soundBuffer.sampleRate);
	const {
		renderParametersPanel,
	} = soundParameters;
	const {
		renderSoundView,
	} = useSoundView({
		soundBufferManager,
		soundParameters,
		isLive,
	});

	const { renderProgressBarView } = useSoundProgressBar(soundBufferManager);

	const getRootStateName = () => {
		if (isOpenParameters) return 'withTopPanel';
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
			<SoundWorkshopSidebar
				soundBufferManager={soundBufferManager}
			/>
		</div>
	);
};

export const SoundWorkshop: FC = () => {
	return (
		<SoundWorkshopProvider>
			<SoundWorkshopMarkup />
		</SoundWorkshopProvider>
	);
};
