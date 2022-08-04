import React, { ReactElement } from 'react';
import { createUseClasses, createClasses } from '../AppContexts/Css';

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

export function Divider(): ReactElement {
	const classes = useClasses();

	return (
		<div className={classes.root} />
	);
}
