import React from 'react';
import { createUseClasses, createClasses, className } from '../AppContexts/Css';
import { SFC } from '../UtilityTypes';
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
export const Checkbox: SFC<CheckboxProps, 'required'> = (props) => {
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

	const onChange = (): void => {
		if (disabled) return;
		onToggle();
	};
	return (
		<label className={rootName} title={title}>
			<input
				className={classes.input}
				type='checkbox'
				onChange={onChange}
				checked={checked}
			/>
			<Field {...fieldProps}>
				{children}
			</Field>
		</label>
	);
};
Checkbox.displayName = 'Checkbox';
