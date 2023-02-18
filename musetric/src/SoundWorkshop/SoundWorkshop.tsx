import className from 'classnames';
import React from 'react';
import { createClasses, createUseClasses } from '../AppContexts/Css';
import { SFC } from '../UtilityTypes';
import {
	SoundWorkshopSidebar, SoundWorkshopToolbar,
	SoundWorkshopProgressBar, SoundWorkshopView,
	SoundWorkshopTopPanel,
} from './Panels';
import { SoundWorkshopProvider, useSoundWorkshopStore } from './Store';

export const getSoundWorkshopClasses = createClasses(() => {
	return {
		root: {
			display: 'grid',
			overflow: 'hidden',
			'&.default': {
				'grid-template-rows': '1fr 56px 50px',
				'grid-template-columns': '1fr 50px',
				'grid-template-areas': `
					"view sidebar"
					"progressBar sidebar"
					"toolbar sidebar"
				`,
			},
			'&.withTopPanel': {
				'grid-template-rows': '1fr 1fr 56px 50px',
				'grid-template-columns': '1fr 50px',
				'grid-template-areas': `
					"topPanel sidebar"
					"view sidebar"
					"progressBar sidebar"
					"toolbar sidebar"
				`,
			},
		},
		topPanel: {
			'grid-area': 'topPanel',
		},
	};
});
const useClasses = createUseClasses('SoundWorkshop', getSoundWorkshopClasses);

export const SoundWorkshopMarkup: SFC = () => {
	const classes = useClasses();

	const store = useSoundWorkshopStore();
	const { isOpenParameters } = store;

	const getRootStateName = (): string => {
		if (isOpenParameters) return 'withTopPanel';
		return 'default';
	};
	const rootName = className({
		[classes.root]: true,
		[getRootStateName()]: true,
	});

	return (
		<div className={rootName}>
			{isOpenParameters && <SoundWorkshopTopPanel />}
			<SoundWorkshopView />
			<SoundWorkshopProgressBar />
			<SoundWorkshopToolbar />
			<SoundWorkshopSidebar />
		</div>
	);
};

export const SoundWorkshop: SFC = () => {
	return (
		<SoundWorkshopProvider>
			<SoundWorkshopMarkup />
		</SoundWorkshopProvider>
	);
};