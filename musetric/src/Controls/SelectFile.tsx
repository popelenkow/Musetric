import React, { useMemo, useEffect } from 'react';
import { createUseClasses, createClasses } from '../AppContexts/Css';
import { SFC } from '../UtilityTypes/React';
import { Button, ButtonProps, getButtonClasses } from './Button';

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
	kind?: 'simple' | 'icon' | 'full',
	align?: 'left' | 'center' | 'right',
	disabled?: boolean,
	primary?: boolean,
	rounded?: boolean,
	title?: string,
	changeFile: (file: File) => void,
};
export const SelectFile: SFC<SelectFileProps, { children: 'required' }> = (props) => {
	const {
		kind, disabled, primary, rounded,
		title, changeFile, children,
	} = props;
	const classes = useClasses();

	const input = useMemo(() => {
		const result = document.createElement('input');
		result.type = 'file';
		return result;
	}, []);

	useEffect(() => {
		input.onchange = (event): void => {
			const { target } = event;
			const isInput = (element: EventTarget | null): element is HTMLInputElement => (
				element instanceof HTMLInputElement
			);
			if (!isInput(target)) return;
			const file = target.files?.item(0);
			if (!file) return;
			changeFile(file);
		};
	});

	const buttonProps: ButtonProps = {
		kind,
		disabled,
		primary,
		rounded,
		title,
		onClick: () => input.click(),
		classNames: { root: classes.root },
	};

	return (
		<Button {...buttonProps}>
			{children}
		</Button>
	);
};
