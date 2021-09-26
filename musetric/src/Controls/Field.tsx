import React, { FC } from 'react';
import { createUseClasses, createClasses } from '../AppContexts/Css';

export const getFieldClasses = createClasses((css) => {
	const { content } = css.theme;
	return {
		root: {
			font: '18px/24px "Segoe UI", Arial, sans-serif',
			display: 'flex',
			'justify-content': 'center',
			'align-items': 'center',
			color: content,
			'& path, rect, polygon': {
				fill: content,
			},
		},
	};
});
const useClasses = createUseClasses('Field', getFieldClasses);

export type FieldProps = {
};
export const Field: FC<FieldProps> = (props) => {
	const { children } = props;
	const classes = useClasses();

	return (
		<div className={classes.root}>
			{children}
		</div>
	);
};
