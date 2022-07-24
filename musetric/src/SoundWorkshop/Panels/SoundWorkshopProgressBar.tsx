import React, { FC } from 'react';
import { createClasses, createUseClasses } from '../../AppContexts/Css';
import { SoundProgressBar, SoundProgressBarProps } from '../Components';
import { useSoundWorkshopStore } from '../Store';

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

export type SoundWorkshopProgressBarProps = object;
export const SoundWorkshopProgressBar: FC<SoundWorkshopProgressBarProps> = () => {
	const classes = useClasses();

	const store = useSoundWorkshopStore();

	const soundProgressBarProps: SoundProgressBarProps = {
		soundBufferManager: store.soundBufferManager,
	};

	return (
		<div className={classes.root}>
			<SoundProgressBar {...soundProgressBarProps} />
		</div>
	);
};
