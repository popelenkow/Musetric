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
import { SoundWorkshopStore, useSoundWorkshopStore } from '../Store';

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

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const select = (store: SoundWorkshopStore) => {
	const {
		isOpenParameters,
		setIsOpenParameters,
		isLive,
		setIsLive,
		soundViewId,
		setSoundViewId,
		soundBufferManager,
	} = store;
	return {
		isOpenParameters,
		setIsOpenParameters,
		isLive,
		setIsLive,
		soundViewId,
		setSoundViewId,
		soundBufferManager,
	};
};

export const SoundWorkshopSidebar: SFC = () => {
	const classes = useClasses();

	const store = useSoundWorkshopStore(select);

	const soundOpenParametersButtonProps: SoundOpenParametersButtonProps = {
		isOpenParameters: store.isOpenParameters,
		setIsOpenParameters: (value) => (
			store.setIsOpenParameters(value)
		),
	};

	const soundLiveButtonProps: SoundLiveButtonProps = {
		isLive: store.isLive,
		setIsLive: (value) => {
			store.setIsLive(value);
		},
	};
	const soundWaveformButtonProps: SoundWaveformButtonProps = {
		soundViewId: store.soundViewId,
		setSoundViewId: (value) => {
			store.setSoundViewId(value);
		},
	};
	const soundFrequencyButtonProps: SoundFrequencyButtonProps = {
		soundViewId: store.soundViewId,
		setSoundViewId: (value) => {
			store.setSoundViewId(value);
		},
	};
	const soundSpectrogramButtonProps: SoundSpectrogramButtonProps = {
		soundViewId: store.soundViewId,
		setSoundViewId: (value) => {
			store.setSoundViewId(value);
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
