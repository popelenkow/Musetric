import React from 'react';
import { createClasses, createUseClasses } from '../../App/AppCss';
import { SFC } from '../../UtilityTypes/React';
import { SoundFrequencyButton } from '../Controls/SoundFrequencyButton';
import { SoundLiveButton } from '../Controls/SoundLiveButton';
import { SoundOpenFileButton } from '../Controls/SoundOpenFileButton';
import { SoundOpenParametersButton } from '../Controls/SoundOpenParametersButton';
import { SoundSaveFileButton } from '../Controls/SoundSaveFileButton';
import { SoundSpectrogramButton } from '../Controls/SoundSpectrogramButton';
import { SoundWaveformButton } from '../Controls/SoundWaveformButton';

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
			'background-color': theme.backgroundPanel,
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
		bottom: {
			display: 'flex',
			'flex-direction': 'column',
		},
	};
});
const useClasses = createUseClasses('SoundWorkshopSidebar', getSoundWorkshopSidebarClasses);

export const SoundWorkshopSidebar: SFC = () => {
	const classes = useClasses();

	return (
		<div className={classes.root}>
			<div className={classes.top}>
				<SoundOpenFileButton />
				<SoundSaveFileButton />
			</div>
			<div className={classes.middle}>
				<SoundLiveButton />
				<SoundWaveformButton />
				<SoundFrequencyButton />
				<SoundSpectrogramButton />
			</div>
			<div className={classes.bottom}>
				<SoundOpenParametersButton />
			</div>
		</div>
	);
};
