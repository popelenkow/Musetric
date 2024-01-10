import React from 'react';
import { createUseClasses } from '../App/AppCss';
import { themeVariables } from '../AppBase/Theme';
import { SFC } from '../UtilityTypes/React';

const useClasses = createUseClasses('Divider', {
	root: {
		width: '100%',
		'border-top': `1px solid var(${themeVariables.divider})`,
	},
});

export const Divider: SFC = () => {
	const classes = useClasses();

	return (
		<div className={classes.root} />
	);
};
