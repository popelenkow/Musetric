import React, { useState } from 'react';
import { createClasses, createUseClasses } from '../AppContexts/Css';
import { ChildrenProps, FCResult } from '../UtilityTypes';
import { getButtonClasses, Button, ButtonProps } from './Button';

export const getSwitchClasses = createClasses((css) => {
	const buttonClasses = getButtonClasses(css);
	return {
		root: {
			...buttonClasses.root,
		},
	};
});
const useClasses = createUseClasses('Switch', getSwitchClasses);

export type SwitchProps<T> = {
	kind?: 'simple' | 'icon' | 'full',
	align?: 'left' | 'center' | 'right',
	disabled?: boolean,
	primary?: boolean,
	rounded?: boolean,
	title?: string,
	currentId: T,
	ids: T[],
	set: (id: T) => void,
};
type SwitchFC = (
	<T>(props: SwitchProps<T> & ChildrenProps) => FCResult
);
export const Switch: SwitchFC = (props) => {
	const {
		kind,
		disabled,
		primary,
		rounded,
		title,
		currentId,
		ids,
		set,
		children,
	} = props;
	const classes = useClasses();

	const [id, setId] = useState(currentId);

	const next = (): void => {
		let index = ids.indexOf(id);
		index = (index + 1) % ids.length;
		const newId = ids[index];
		setId(newId);
		set(newId);
	};

	const buttonProps: ButtonProps = {
		kind,
		disabled,
		primary,
		rounded,
		title,
		onClick: next,
		classNames: { root: classes.root },
	};
	return (
		<Button {...buttonProps}>
			{children}
		</Button>
	);
};
