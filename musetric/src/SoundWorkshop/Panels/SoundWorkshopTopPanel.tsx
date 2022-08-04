import React, { ReactElement } from 'react';
import { createClasses, createUseClasses } from '../../AppContexts/Css';
import { SoundParametersPanel, SoundParametersPanelProps } from '../Components';
import { SoundParameters, useSoundWorkshopStore } from '../Store';

export const getSoundWorkshopTopPanelClasses = createClasses(() => {
	return {
		root: {
			'grid-area': 'topPanel',
		},
	};
});
const useClasses = createUseClasses('SoundWorkshopTopPanel', getSoundWorkshopTopPanelClasses);

export function SoundWorkshopTopPanel(): ReactElement {
	const classes = useClasses();

	const store = useSoundWorkshopStore();

	const soundParametersPanelProps: SoundParametersPanelProps = {
		soundParameters: store.soundParameters,
		setSoundParameters: (soundParameters: SoundParameters) => (
			store.dispatch({
				type: 'setSoundParameters',
				soundParameters,
			})
		),
	};

	return (
		<div className={classes.root}>
			<SoundParametersPanel {...soundParametersPanelProps} />
		</div>
	);
}
