import className from 'classnames';
import React from 'react';
import { createClasses, createUseClasses } from '../AppContexts/Css';
import { SFC } from '../UtilityTypes';
import {
	SoundWorkshopSidebar, SoundWorkshopToolbar,
	SoundWorkshopProgressBar, SoundWorkshopView,
	SoundWorkshopTopPanel,
} from './Panels';
import { SoundWorkshopProvider, SoundWorkshopStore, useSoundWorkshopStore } from './Store';

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

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const select = (store: SoundWorkshopStore) => {
	const { isOpenParameters } = store;
	return {
		isOpenParameters,
	};
};

const SoundWorkshop: SFC = () => {
	const classes = useClasses();

	const store = useSoundWorkshopStore(select);
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

const WithStore: SFC = () => (
	<SoundWorkshopProvider>
		<SoundWorkshop />
	</SoundWorkshopProvider>
);
export {
	WithStore as SoundWorkshop,
};
