import React from 'react';
import { createUseClasses, createClasses } from '../AppContexts/Css';
import { SFC } from '../UtilityTypes';

export const getDividerClasses = createClasses((css) => {
	const { theme } = css;
	return {
		root: {
			width: '100%',
			margin: '4px 0',
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
