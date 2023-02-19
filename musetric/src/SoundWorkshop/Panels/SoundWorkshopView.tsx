import React from 'react';
import { createClasses, createUseClasses } from '../../AppContexts/Css';
import { SFC } from '../../UtilityTypes';
import { SoundView, SoundViewProps } from '../Components';
import { SoundWorkshopStore, useSoundWorkshopStore } from '../Store';

export const getSoundWorkshopViewClasses = createClasses((css) => {
	const { theme } = css;
	return {
		root: {
			'grid-area': 'view',
			overflow: 'hidden',
			'background-color': theme.background,
			display: 'flex',
			position: 'relative',
		},
	};
});
const useClasses = createUseClasses('SoundWorkshopView', getSoundWorkshopViewClasses);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const select = (store: SoundWorkshopStore) => {
	const { isLive, soundBufferManager, soundParameters } = store;
	return {
		isLive, soundBufferManager, soundParameters,
	};
};

export const SoundWorkshopView: SFC = () => {
	const classes = useClasses();

	const store = useSoundWorkshopStore(select);
	const { isLive, soundBufferManager, soundParameters } = store;

	const soundViewProps: SoundViewProps = {
		soundBufferManager,
		soundParameters,
		isLive,
	};

	return (
		<div className={classes.root}>
			<SoundView {...soundViewProps} />
		</div>
	);
};
