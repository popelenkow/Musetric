import React, { FC, ChangeEvent } from 'react';
import { createUseClasses, createClasses } from '../AppContexts/Css';
import { getButtonClasses } from './Button';

export const getSelectFileClasses = createClasses((css) => {
	const buttonClasses = getButtonClasses(css);
	return {
		root: {
			...buttonClasses.root,
		},
		input: {
			opacity: '0',
			position: 'absolute',
			top: '0',
			left: '0',
			width: '100%',
			height: '100%',
		},
	};
});
const useClasses = createUseClasses('SelectFile', getSelectFileClasses);

export type SelectFileProps = {
	onChangeFile: (file: File) => void;
	className?: string;
};
export const SelectFile: FC<SelectFileProps> = (props) => {
	const { children, onChangeFile, className } = props;
	const classes = useClasses();

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
