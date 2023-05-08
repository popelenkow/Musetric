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
	| 'remove'
	| 'save'
	| 'spectrogram'
	| 'stop'
	| 'storage'
	| 'waveform'
);
export type IconProps = {
	name: IconName,
};
export const Icon: SFC<IconProps> = (props) => {
	const { name } = props;
	const classes = useClasses();

	const url = new URL(`/Icons.svg#${name}`, window.location.href);

	return (
		<svg className={classes.root} aria-hidden='true'>
			<use href={url.toString()} />
		</svg>
	);
};
