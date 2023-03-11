import React from 'react';
import { createUseClasses, createClasses } from '../App/AppCss';
import { SFC } from '../UtilityTypes/React';

export const getIconClasses = createClasses(() => {
	return {
		root: {
			width: '24px',
			height: '24px',
		},
	};
});
const useClasses = createUseClasses('Icon', getIconClasses);

export type IconName = (
	| 'app'
	| 'close'
	| 'dark'
	| 'frequency'
	| 'github'
	| 'info'
	| 'light'
	| 'live'
	| 'menu'
	| 'openFile'
	| 'parameters'
	| 'performance'
	| 'play'
	| 'record'
	| 'save'
	| 'spectrogram'
	| 'stop'
	| 'waveform'
);
export type IconProps = {
	name: IconName,
};
export const Icon: SFC<IconProps> = (props) => {
	const { name } = props;
	const classes = useClasses();

	return (
		<svg className={classes.root} aria-hidden='true'>
			<use href={`/Icons.svg#${name}`} />
		</svg>
	);
};
