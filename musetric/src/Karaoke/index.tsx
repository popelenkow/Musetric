import React from 'react';
import { createClasses, createUseClasses } from '../App/AppCss';
import { SFC } from '../UtilityTypes/React';
import { KaraokeProvider } from './KaraokeContext';
import { SoundOpenFileButton } from './SoundOpenFileButton';

export const getSoundWorkshopClasses = createClasses(() => {
	return {
		root: {},
	};
});
const useClasses = createUseClasses('SoundWorkshop', getSoundWorkshopClasses);

const Karaoke: SFC = () => {
	const classes = useClasses();

	return (
		<div className={classes.root}>
			<SoundOpenFileButton />
		</div>
	);
};

const WithStore: SFC = () => (
	<KaraokeProvider>
		<Karaoke />
	</KaraokeProvider>
);
export {
	WithStore as Karaoke,
};
