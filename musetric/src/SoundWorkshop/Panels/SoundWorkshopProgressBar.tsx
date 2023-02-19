import React from 'react';
import { createClasses, createUseClasses } from '../../AppContexts/Css';
import { SFC } from '../../UtilityTypes';
import { SoundProgressBar, SoundProgressBarProps } from '../Components';
import { SoundWorkshopStore, useSoundWorkshopStore } from '../Store';

export const getSoundWorkshopProgressBarClasses = createClasses((css) => {
	const { theme } = css;
	return {
		root: {
			'grid-area': 'progressBar',
			'box-sizing': 'border-box',
			overflow: 'hidden',
			'background-color': theme.background,
			'border-top': `1px solid ${theme.divider}`,
		},
	};
});
const useClasses = createUseClasses('SoundWorkshopProgressBar', getSoundWorkshopProgressBarClasses);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const select = (store: SoundWorkshopStore) => {
	const { soundBufferManager } = store;
	return {
		soundBufferManager,
	};
};

export const SoundWorkshopProgressBar: SFC = () => {
	const classes = useClasses();

	const store = useSoundWorkshopStore(select);

	const soundProgressBarProps: SoundProgressBarProps = {
		soundBufferManager: store.soundBufferManager,
	};

	return (
		<div className={classes.root}>
			<SoundProgressBar {...soundProgressBarProps} />
		</div>
	);
};
