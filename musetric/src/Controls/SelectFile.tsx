/* eslint-disable jsx-a11y/media-has-caption */
import React from 'react';
import { createUseStyles } from 'react-jss';
import { getButtonStyles, Theme } from '..';
import { theming } from '../Contexts';

export const getSelectFileStyles = (theme: Theme) => ({
	root: {
		...getButtonStyles(theme).root,
	},
	input: {
		opacity: '0',
		position: 'absolute',
		top: '0',
		left: '0',
		width: '100%',
		height: '100%',
	},
});

export const useSelectFileStyles = createUseStyles(getSelectFileStyles, { name: 'SelectFile', theming });

export type SelectFileProps = {
	onChangeFile: (file: File) => void;
	className?: string;
};

export const SelectFile: React.FC<SelectFileProps> = (props) => {
	const { children, onChangeFile, className } = props;
	const classes = useSelectFileStyles();

	const onChange = (input: React.ChangeEvent<HTMLInputElement>) => {
		const file = input.target.files?.item(0);
		if (file) {
			onChangeFile(file);
		}
	};

	return (
		<div className={className || classes.root}>
			{children}
			<input type='file' className={classes.input} onChange={onChange} />
		</div>
	);
};
