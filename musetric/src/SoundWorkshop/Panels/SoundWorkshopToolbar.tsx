import React from 'react';
import { createClasses, createUseClasses } from '../../AppContexts/Css';
import { SFC } from '../../UtilityTypes';
import {
	SoundProgress,
	SoundPlayerButton, SoundPlayerButtonProps,
	SoundRecorderButton, SoundRecorderButtonProps,
} from '../Controls';
import { SoundWorkshopStore, useSoundWorkshopStore } from '../Store';

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

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const select = (store: SoundWorkshopStore) => {
	const {
		isLive, isPlaying, isRecording,
		setIsRecording, setIsPlaying, soundBufferManager,
	} = store;
	return {
		isLive,
		isPlaying,
		isRecording,
		setIsRecording,
		setIsPlaying,
		soundBufferManager,
	};
};

export const SoundWorkshopToolbar: SFC = () => {
	const classes = useClasses();

	const store = useSoundWorkshopStore(select);
	const {
		isLive, isPlaying, isRecording,
		setIsRecording, setIsPlaying, soundBufferManager,
	} = store;

	const soundPlayerButtonProps: SoundPlayerButtonProps = {
		disabled: isRecording,
		soundBufferManager,
		isPlaying,
		setIsPlaying: (value) => {
			setIsPlaying(value);
		},
	};

	const soundRecorderButtonProps: SoundRecorderButtonProps = {
		disabled: isPlaying,
		soundBufferManager,
		isLive,
		isRecording,
		setIsRecording: (value) => {
			setIsRecording(value);
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
