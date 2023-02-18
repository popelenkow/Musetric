import React from 'react';
import { createClasses, createUseClasses } from '../../AppContexts/Css';
import { SFC } from '../../UtilityTypes';
import { SoundView, SoundViewProps } from '../Components';
import { useSoundWorkshopStore } from '../Store';

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

export const SoundWorkshopView: SFC = () => {
	const classes = useClasses();

	const store = useSoundWorkshopStore();
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
