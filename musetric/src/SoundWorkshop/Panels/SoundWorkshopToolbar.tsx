import React from 'react';
import { createClasses, createUseClasses } from '../../AppContexts/Css';
import { SFC } from '../../UtilityTypes';
import {
	SoundProgress,
	SoundPlayerButton, SoundPlayerButtonProps,
	SoundRecorderButton, SoundRecorderButtonProps,
} from '../Controls';
import { useSoundWorkshopStore } from '../Store';

export const getSoundWorkshopToolbarClasses = createClasses((css) => {
	const { theme } = css;
	return {
		root: {
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
const useClasses = createUseClasses('SoundWorkshopToolbar', getSoundWorkshopToolbarClasses);

export const SoundWorkshopToolbar: SFC = () => {
	const classes = useClasses();

	const store = useSoundWorkshopStore();
	const { isLive, isPlaying, isRecording, soundBufferManager } = store;

	const soundPlayerButtonProps: SoundPlayerButtonProps = {
		disabled: isRecording,
		soundBufferManager,
		isPlaying,
		setIsPlaying: (value) => {
			store.dispatch({ type: 'setIsPlaying', isPlaying: value });
		},
	};

	const soundRecorderButtonProps: SoundRecorderButtonProps = {
		disabled: isPlaying,
		soundBufferManager,
		isLive,
		isRecording,
		setIsRecording: (value) => {
			store.dispatch({ type: 'setIsRecording', isRecording: value });
		},
	};

	return (
		<div className={classes.root}>
			<SoundPlayerButton {...soundPlayerButtonProps} />
			<SoundProgress soundBufferManager={soundBufferManager} />
			<SoundRecorderButton {...soundRecorderButtonProps} />
		</div>
	);
};
