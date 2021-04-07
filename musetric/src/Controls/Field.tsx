import React from 'react';
import { Theme, createUseClasses } from '..';

export const getFieldClasses = (theme: Theme) => ({
	root: {
		font: '18px/24px "Segoe UI", Arial, sans-serif',
		display: 'flex',
		'justify-content': 'center',
		'align-items': 'center',
		color: theme.color.content,
		'& path, rect, polygon': {
			fill: theme.color.content,
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
