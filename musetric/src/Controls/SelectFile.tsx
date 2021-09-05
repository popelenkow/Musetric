import React, { FC, ChangeEvent } from 'react';
import { createUseClasses, Css } from '../AppContexts/CssContext';
import { getButtonClasses } from './Button';

export const getSelectFileClasses = (css: Css) => ({
	root: {
		...getButtonClasses(css).root,
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

export const useSelectFileClasses = createUseClasses('SelectFile', getSelectFileClasses);

export type SelectFileProps = {
	onChangeFile: (file: File) => void;
	className?: string;
};

export const SelectFile: FC<SelectFileProps> = (props) => {
	const { children, onChangeFile, className } = props;
	const classes = useSelectFileClasses();

	const onChange = (input: ChangeEvent<HTMLInputElement>) => {
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
