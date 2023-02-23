import React from 'react';
import { createClasses, createUseClasses } from '../../AppContexts/Css';
import { SFC } from '../../UtilityTypes';
import { SoundParametersPanel, SoundView } from '../Components';
import { SoundWorkshopStore, useSoundWorkshopStore } from '../Store';
import { SoundWorkshopProgressBar } from './SoundWorkshopProgressBar';

export const getSoundWorkshopViewClasses = createClasses((css) => {
	const { theme } = css;
	return {
		root: {
			'grid-area': 'main',
			overflow: 'hidden',
			display: 'flex',
			'flex-direction': 'column',
			'background-color': theme.background,
		},
		view: {
			overflow: 'hidden',
			height: '100%',
			display: 'grid',
			'grid-template-rows': '1fr 56px',
			'grid-template-columns': '1fr',
			'grid-template-areas': `
				"view"
				"progressBar"
			`,
			'& > *': {
				overflow: 'hidden',
			},
		},
	};
});
const useClasses = createUseClasses('SoundWorkshopView', getSoundWorkshopViewClasses);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const select = (store: SoundWorkshopStore) => {
	const { isOpenParameters } = store;
	return {
		isOpenParameters,
	};
};

export const SoundWorkshopMain: SFC = () => {
	const classes = useClasses();

	const store = useSoundWorkshopStore(select);
	const { isOpenParameters } = store;

	return (
		<div className={classes.root}>
			<div className={classes.view}>
				<SoundView />
				<SoundWorkshopProgressBar />
			</div>
			{isOpenParameters && <SoundParametersPanel />}
		</div>
	);
};
