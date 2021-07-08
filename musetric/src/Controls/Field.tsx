import React from 'react';
import { AppCss, createUseClasses } from '..';

export const getFieldClasses = (css: AppCss) => ({
	root: {
		font: '18px/24px "Segoe UI", Arial, sans-serif',
		display: 'flex',
		'justify-content': 'center',
		'align-items': 'center',
		color: css.theme.content,
		'& path, rect, polygon': {
			fill: css.theme.content,
		},
	},
});

export const useFieldClasses = createUseClasses('Field', getFieldClasses);

export type FieldProps = {
};

export const Field: React.FC<FieldProps> = (props) => {
	const { children } = props;
	const classes = useFieldClasses();

	return (
		<div className={classes.root}>
			{children}
		</div>
	);
};
