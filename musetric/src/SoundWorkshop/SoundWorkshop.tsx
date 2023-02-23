import React from 'react';
import { createClasses, createUseClasses } from '../AppContexts/Css';
import { SFC } from '../UtilityTypes';
import {
	SoundWorkshopSidebar, SoundWorkshopToolbar,
	SoundWorkshopMain,
} from './Panels';
import { SoundWorkshopProvider } from './Store';

export const getSoundWorkshopClasses = createClasses(() => {
	return {
		root: {
			display: 'grid',
			overflow: 'hidden',
			'grid-template-rows': '1fr 50px',
			'grid-template-columns': '1fr 50px',
			'grid-template-areas': `
				"main sidebar"
				"toolbar sidebar"
			`,
		},
	};
});
const useClasses = createUseClasses('SoundWorkshop', getSoundWorkshopClasses);

const SoundWorkshop: SFC = () => {
	const classes = useClasses();

	return (
		<div className={classes.root}>
			<SoundWorkshopToolbar />
			<SoundWorkshopSidebar />
			<SoundWorkshopMain />
		</div>
	);
};

const WithStore: SFC = () => (
	<SoundWorkshopProvider>
		<SoundWorkshop />
	</SoundWorkshopProvider>
);
export {
	WithStore as SoundWorkshop,
};
