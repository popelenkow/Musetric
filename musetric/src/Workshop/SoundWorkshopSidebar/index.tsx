import React, { FC } from 'react';
import { createClasses, createUseClasses } from '../../AppContexts/Css';
import { SoundBufferManager } from '../../Sounds/SoundBufferManager';
import { SoundSaveFileButton } from './SoundSaveFileButton';
import { SoundOpenFileButton } from './SoundOpenFileButton';
import { SoundLiveButton } from '../SoundLive';
import { SoundWaveformButton } from './SoundWaveformButton';
import { SoundFrequencyButton } from './SoundFrequencyButton';
import { SoundSpectrogramButton } from './SoundSpectrogramButton';
import { SoundOpenParametersButton } from './SoundOpenParametersButton';

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
			'background-color': theme.activeBackground,
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
	};
});
const useClasses = createUseClasses('SoundWorkshopSidebar', getSoundWorkshopSidebarClasses);

export type SoundWorkshopSidebarProps = {
	soundBufferManager: SoundBufferManager;
};
export const SoundWorkshopSidebar: FC<SoundWorkshopSidebarProps> = (props) => {
	const { soundBufferManager } = props;

	const classes = useClasses();

	return (
		<div className={classes.root}>
			<div className={classes.top}>
				<SoundOpenParametersButton />
			</div>
			<div className={classes.middle}>
				<SoundLiveButton />
				<SoundWaveformButton />
				<SoundFrequencyButton />
				<SoundSpectrogramButton />
				<SoundOpenFileButton
					soundBufferManager={soundBufferManager}
				/>
				<SoundSaveFileButton
					soundBufferManager={soundBufferManager}
				/>
			</div>
		</div>
	);
};
