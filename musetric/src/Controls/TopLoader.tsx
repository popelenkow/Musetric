import React from 'react';
import { createClasses, createUseClasses } from '../App/AppCss';
import { SFC } from '../UtilityTypes/React';

export const getTopLoaderClasses = createClasses((css) => {
	const { theme } = css;
	return {
		root: {
			position: 'absolute',
			width: '100%',
			height: '4px',
		},
		cursor: {
			width: '10%',
			height: '100%',
			position: 'relative',
			'background-color': theme.divider,
			'animation-name': '$loading',
			'animation-duration': '1.4s',
			'animation-iteration-count': 'infinite',
			'animation-timing-function': 'linear',
		},
		'@keyframes loading': {
			from: {
				'margin-left': '-10%',
			},
			to: {
				'margin-left': '100%',
			},
		},
	};
});
const useClasses = createUseClasses('TopLoader', getTopLoaderClasses);

export const TopLoader: SFC = () => {
	const classes = useClasses();

	return (
		<div className={classes.root}>
			<div className={classes.cursor} />
		</div>
	);
};
