import React from 'react';
import { createUseClasses } from '../../App/AppCss';
import { themeVariables } from '../../AppBase/Theme';
import { SFC } from '../../UtilityTypes/React';
import { SoundPlayerButton } from '../Controls/SoundPlayerButton';
import { SoundProgress } from '../Controls/SoundProgress';
import { SoundRecorderButton } from '../Controls/SoundRecorderButton';

const useClasses = createUseClasses('SoundWorkshopToolbar', {
	root: {
		'grid-area': 'toolbar',
		'box-sizing': 'border-box',
		padding: '0px 4px',
		display: 'flex',
		'flex-direction': 'row',
		'justify-content': 'center',
		'align-items': 'center',
		'column-gap': '4px',
		'background-color': `var(${themeVariables.backgroundPanel})`,
		'border-top': `1px solid var(${themeVariables.divider})`,
	},
});

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
