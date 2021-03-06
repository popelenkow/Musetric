/* eslint-disable jsx-a11y/media-has-caption */
import React from 'react';
import { createUseStyles } from 'react-jss';
import { theming } from '../Contexts';

export const getSelectFileStyles = () => ({
	root: {
		position: 'relative',
		border: '1px solid red',
		'line-height': '30px',
		'text-align': 'center',
	},
	input: {
		opacity: '0.0',
		position: 'absolute',
		top: '0',
		left: '0',
		bottom: '0',
		right: '0',
		width: '100%',
		height: '100%',
	},
});

export const useSelectFileStyles = createUseStyles(getSelectFileStyles(), { name: 'SelectFile', theming });

export type SelectFileProps = {
	onChange: React.FormEventHandler<HTMLInputElement>;
	className?: string;
};

export const SelectFile: React.FC<SelectFileProps> = (props) => {
	const { children, onChange, className } = props;
	const classes = useSelectFileStyles();

	return (
		<div className={className || classes.root}>
			{children}
			<input type='file' className={classes.input} onChange={onChange} />
		</div>
	);
};
