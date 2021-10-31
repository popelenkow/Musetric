import React, { FC } from 'react';
import { createUseClasses, createClasses } from '../AppContexts/Css';

export const getDividerClasses = createClasses((css) => {
	const { divider: splitter } = css.theme;
	return {
		root: {
			width: '100%',
			margin: '4px 0',
			'border-top': `1px solid ${splitter}`,
		},
	};
});
const useClasses = createUseClasses('Divider', getDividerClasses);

export type DividerProps = {
};
export const Divider: FC<DividerProps> = () => {
	const classes = useClasses();

	return (
		<div className={classes.root} />
	);
};
