import React from 'react';
import { createClasses, createUseClasses } from '../AppContexts/Css';
import { SFC } from '../UtilityTypes/React';
import { SoundView } from './Components/SoundView';
import { KeyboardSubscription } from './Components/KeyboardSubscription';
import { SoundParametersPanel } from './Components/SoundParametersPanel';
import { SoundWorkshopProgressBar } from './Panels/SoundWorkshopProgressBar';
import { SoundWorkshopSidebar } from './Panels/SoundWorkshopSidebar';
import { SoundWorkshopToolbar } from './Panels/SoundWorkshopToolbar';
import { SoundWorkshopProvider } from './SoundWorkshopContext';

export const getSoundWorkshopClasses = createClasses((css) => {
	const { theme } = css;
	return {
		root: {
			'background-color': theme.background,
			display: 'grid',
			overflow: 'hidden',
			'grid-template-rows': '1fr 50px',
			'grid-template-columns': '1fr 50px',
			'grid-template-areas': `
				"main sidebar"
				"toolbar sidebar"
			`,
		},
		main: {
			'grid-area': 'main',
			overflow: 'hidden',
			display: 'flex',
			'flex-direction': 'column',
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
const useClasses = createUseClasses('SoundWorkshop', getSoundWorkshopClasses);

const SoundWorkshop: SFC = () => {
	const classes = useClasses();

	return (
		<div className={classes.root}>
			<SoundWorkshopToolbar />
			<SoundWorkshopSidebar />
			<div className={classes.main}>
				<div className={classes.view}>
					<SoundView />
					<SoundWorkshopProgressBar />
				</div>
				<SoundParametersPanel />
			</div>
			<KeyboardSubscription />
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
