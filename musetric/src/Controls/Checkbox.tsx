import React, { ReactElement, ReactNode } from 'react';
import { createUseClasses, createClasses, className } from '../AppContexts/Css';
import { getButtonClasses } from './Button';
import { Field, FieldProps } from './Field';

export const getCheckboxClasses = createClasses((css) => {
	const { theme } = css;
	const buttonClasses = getButtonClasses(css);
	return {
		root: {
			display: 'block',
		},
		input: {
			position: 'absolute',
			opacity: '0',
			'&:focus-visible + *': {
				border: `1px solid ${theme.divider}`,
			},
		},
		button: {
			...buttonClasses.root,
		},
	};
});
const useClasses = createUseClasses('Checkbox', getCheckboxClasses);

export type CheckboxProps = {
	kind?: 'simple' | 'icon' | 'full',
	align?: 'left' | 'center' | 'right',
	disabled?: boolean,
	primary?: boolean,
	rounded?: boolean,
	title?: string,
	onToggle: () => void,
	checked?: boolean,
	classNames?: {
		root?: string,
	},
};
export function Checkbox(
	props: CheckboxProps & { children: ReactNode },
): ReactElement {
	const {
		kind, disabled, rounded,
		title, onToggle, checked,
		classNames, children,
	} = props;
	const classes = useClasses();

	const rootName = className(
		classNames?.root || classes.root,
	);

	const fieldProps: FieldProps = {
		kind,
		disabled,
		rounded,
		primary: checked,
		classNames: { root: classes.button },
	};

	return (
		<label className={rootName} title={title}>
			<input
				className={classes.input}
				type='checkbox'
				onChange={() => !disabled && onToggle()}
				checked={checked}
			/>
			<Field {...fieldProps}>
				{children}
			</Field>
		</label>
	);
}
