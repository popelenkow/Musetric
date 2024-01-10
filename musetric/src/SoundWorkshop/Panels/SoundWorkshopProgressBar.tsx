import React from 'react';
import { createUseClasses } from '../../App/AppCss';
import { themeVariables } from '../../AppBase/Theme';
import { SFC } from '../../UtilityTypes/React';
import { SoundProgressBar } from '../Components/SoundProgressBar';

const useClasses = createUseClasses('SoundWorkshopProgressBar', {
	root: {
		'grid-area': 'progressBar',
		'box-sizing': 'border-box',
		overflow: 'hidden',
		'background-color': `var(${themeVariables.background})`,
		'border-top': `1px solid var(${themeVariables.divider})`,
	},
});

export const SoundWorkshopProgressBar: SFC = () => {
	const classes = useClasses();

	return (
		<div className={classes.root}>
			<SoundProgressBar />
		</div>
	);
};
