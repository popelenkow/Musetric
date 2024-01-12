import React from 'react';
import { createUseClasses } from '../App/AppCss';
import { themeVariables } from '../AppBase/Theme';
import { SFC } from '../UtilityTypes/React';

const useClasses = createUseClasses('TopLoader', {
	root: {
		position: 'absolute',
		width: '100%',
		height: '4px',
	},
	cursor: {
		width: '10%',
		height: '100%',
		position: 'relative',
		'background-color': `var(${themeVariables.divider})`,
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
});

export const TopLoader: SFC = () => {
	const classes = useClasses();

	return (
		<div className={classes.root}>
			<div className={classes.cursor} />
		</div>
	);
};
