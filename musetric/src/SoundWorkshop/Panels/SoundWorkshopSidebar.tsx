import React from 'react';
import { createClasses, createUseClasses } from '../../AppContexts/Css';
import { SFC } from '../../UtilityTypes';
import {
	SoundSaveFileButton, SoundSaveFileButtonProps,
	SoundOpenFileButton, SoundOpenFileButtonProps,
	SoundLiveButton, SoundLiveButtonProps,
	SoundWaveformButton, SoundWaveformButtonProps,
	SoundFrequencyButton, SoundFrequencyButtonProps,
	SoundSpectrogramButton, SoundSpectrogramButtonProps,
	SoundOpenParametersButton, SoundOpenParametersButtonProps,
} from '../Controls';
import { useSoundWorkshopStore } from '../Store';

export const getSoundWorkshopSidebarClasses = createClasses((css) => {
	const { theme } = css;
	return {
		root: {
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
		top: {
			display: 'flex',
			'flex-direction': 'column',
		},
		middle: {
			height: '100%',
			display: 'flex',
			'flex-direction': 'column',
			'justify-content': 'center',
		},
	};
});
const useClasses = createUseClasses('SoundWorkshopSidebar', getSoundWorkshopSidebarClasses);

export const SoundWorkshopSidebar: SFC = () => {
	const classes = useClasses();

	const store = useSoundWorkshopStore();

	const soundOpenParametersButtonProps: SoundOpenParametersButtonProps = {
		isOpenParameters: store.isOpenParameters,
		setIsOpenParameters: (value) => (
			store.dispatch({ type: 'setIsOpenParameters', isOpenParameters: value })
		),
	};

	const soundLiveButtonProps: SoundLiveButtonProps = {
		isLive: store.isLive,
		setIsLive: (value) => {
			store.dispatch({ type: 'setIsLive', isLive: value });
		},
	};
	const soundWaveformButtonProps: SoundWaveformButtonProps = {
		soundViewId: store.soundViewId,
		setSoundViewId: (value) => {
			store.dispatch({ type: 'setSoundViewId', soundViewId: value });
		},
	};
	const soundFrequencyButtonProps: SoundFrequencyButtonProps = {
		soundViewId: store.soundViewId,
		setSoundViewId: (value) => {
			store.dispatch({ type: 'setSoundViewId', soundViewId: value });
		},
	};
	const soundSpectrogramButtonProps: SoundSpectrogramButtonProps = {
		soundViewId: store.soundViewId,
		setSoundViewId: (value) => {
			store.dispatch({ type: 'setSoundViewId', soundViewId: value });
		},
	};
	const soundOpenFileButtonProps: SoundOpenFileButtonProps = {
		soundBufferManager: store.soundBufferManager,
	};
	const soundSaveFileButtonProps: SoundSaveFileButtonProps = {
		soundBufferManager: store.soundBufferManager,
	};

	return (
		<div className={classes.root}>
			<div className={classes.top}>
				<SoundOpenParametersButton {...soundOpenParametersButtonProps} />
			</div>
			<div className={classes.middle}>
				<SoundLiveButton {...soundLiveButtonProps} />
				<SoundWaveformButton {...soundWaveformButtonProps} />
				<SoundFrequencyButton {...soundFrequencyButtonProps} />
				<SoundSpectrogramButton {...soundSpectrogramButtonProps} />
				<SoundOpenFileButton {...soundOpenFileButtonProps} />
				<SoundSaveFileButton {...soundSaveFileButtonProps} />
			</div>
		</div>
	);
};