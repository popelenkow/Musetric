import React, { FC } from 'react';
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

export const Divider: FC = () => {
	const classes = useClasses();

	return (
		<div className={classes.root} />
	);
};
