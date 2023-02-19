import React from 'react';
import { createClasses, createUseClasses } from '../../AppContexts/Css';
import { SFC } from '../../UtilityTypes';
import { SoundParametersPanel } from '../Components';

export const getSoundWorkshopTopPanelClasses = createClasses(() => {
	return {
		root: {
			'grid-area': 'topPanel',
		},
	};
});
const useClasses = createUseClasses('SoundWorkshopTopPanel', getSoundWorkshopTopPanelClasses);

export const SoundWorkshopTopPanel: SFC = () => {
	const classes = useClasses();

	return (
		<div className={classes.root}>
			<SoundParametersPanel />
		</div>
	);
};
