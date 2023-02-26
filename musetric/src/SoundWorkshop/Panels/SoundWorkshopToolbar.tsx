import React from 'react';
import { createClasses, createUseClasses } from '../../AppContexts/Css';
import { SFC } from '../../UtilityTypes/React';
import { SoundPlayerButton } from '../Controls/SoundPlayerButton';
import { SoundProgress } from '../Controls/SoundProgress';
import { SoundRecorderButton } from '../Controls/SoundRecorderButton';

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

export const SoundWorkshopToolbar: SFC = () => {
	const classes = useClasses();

	return (
		<div className={classes.root}>
			<SoundPlayerButton />
			<SoundProgress />
			<SoundRecorderButton />
		</div>
	);
};
