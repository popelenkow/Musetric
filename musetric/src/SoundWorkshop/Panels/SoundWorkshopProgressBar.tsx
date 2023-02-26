import React from 'react';
import { createClasses, createUseClasses } from '../../AppContexts/Css';
import { SFC } from '../../UtilityTypes/React';
import { SoundProgressBar } from '../Components/SoundProgressBar';

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

export const SoundWorkshopProgressBar: SFC = () => {
	const classes = useClasses();

	return (
		<div className={classes.root}>
			<SoundProgressBar />
		</div>
	);
};
