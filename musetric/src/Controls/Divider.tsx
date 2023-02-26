import React from 'react';
import { createUseClasses, createClasses } from '../AppContexts/Css';
import { SFC } from '../UtilityTypes/React';

export const getDividerClasses = createClasses((css) => {
	const { theme } = css;
	return {
		root: {
			width: '100%',
			'border-top': `1px solid ${theme.divider}`,
		},
	};
});
const useClasses = createUseClasses('Divider', getDividerClasses);

export const Divider: SFC = () => {
	const classes = useClasses();

	return (
		<div className={classes.root} />
	);
};
