import React, { FC, useMemo, useEffect } from 'react';
import { Button, ButtonProps, getButtonClasses } from './Button';
import { createUseClasses, createClasses } from '../AppContexts/Css';

export const getSelectFileClasses = createClasses((css) => {
	const buttonClasses = getButtonClasses(css);
	return {
		root: {
			...buttonClasses.root,
		},
	};
});
const useClasses = createUseClasses('SelectFile', getSelectFileClasses);

export type SelectFileProps = {
	disabled?: boolean;
	primary?: boolean;
	rounded?: boolean;
	onChangeFile: (file: File) => void;
};
export const SelectFile: FC<SelectFileProps> = (props) => {
	const {
		children, onChangeFile,
		disabled, primary, rounded,
	} = props;
	const classes = useClasses();

	const input = useMemo(() => {
		const result = document.createElement('input');
		result.type = 'file';
		return result;
	}, []);

	useEffect(() => {
		input.onchange = (event) => {
			const target = event.target as HTMLInputElement | null;
			const file = target?.files?.item(0);
			if (!file) return;
			onChangeFile(file);
		};
	});

	const buttonProps: ButtonProps = {
		kind: 'icon',
		disabled,
		primary,
		rounded,
		onClick: () => input.click(),
		classNames: { root: classes.root },
	};

	return (
		<Button {...buttonProps}>
			{children}
		</Button>
	);
};
