import React from 'react';
import { createUseClasses, createClasses } from '../App/AppCss';
import { SFC } from '../UtilityTypes/React';
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
};
export const Checkbox: SFC<CheckboxProps, { children: 'required' }> = (props) => {
	const {
		kind, disabled, rounded,
		title, onToggle, checked,
		children,
	} = props;
	const classes = useClasses();

	const fieldProps: FieldProps = {
		kind,
		rounded,
		primary: checked,
		classNames: { root: classes.button },
	};

	return (
		<label className={classes.root} title={title}>
			<input
				className={classes.input}
				type='checkbox'
				onChange={onToggle}
				checked={checked}
				disabled={disabled}
			/>
			<Field {...fieldProps}>
				{children}
			</Field>
		</label>
	);
};
