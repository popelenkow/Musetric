import React from 'react';
import { createUseClasses, createClasses, className } from '../App/AppCss';
import { ChildrenProps, FCResult } from '../UtilityTypes/React';
import { getButtonClasses } from './Button';
import { Field, FieldProps } from './Field';

export const getRadioClasses = createClasses((css) => {
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
const useClasses = createUseClasses('Radio', getRadioClasses);

export type RadioProps<Value extends string> = {
	kind?: 'simple' | 'icon' | 'full',
	align?: 'left' | 'center' | 'right',
	disabled?: boolean,
	primary?: boolean,
	rounded?: boolean,
	title?: string,
	onSelected: (value: Value) => void,
	label: string,
	value: Value,
	checkedValue: Value,
	classNames?: {
		root?: string,
	},
};
type RadioFC = (
	<Value extends string>(props: RadioProps<Value> & ChildrenProps) => FCResult
);
export const Radio: RadioFC = (props) => {
	type Value = (typeof props)['value'];
	const {
		kind,
		disabled,
		rounded,
		title,
		onSelected,
		label,
		value,
		checkedValue,
		classNames,
		children,
	} = props;
	const classes = useClasses();

	const rootName = className(
		classNames?.root || classes.root,
	);

	const checked = checkedValue === value;
	const fieldProps: FieldProps = {
		kind,
		rounded,
		primary: checked,
		classNames: { root: classes.button },
	};

	return (
		<label className={rootName} title={title}>
			<input
				className={classes.input}
				type='radio'
				name={label}
				value={value}
				onChange={(event): void => {
					if (disabled) return;
					// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
					onSelected(event.target.value as Value);
				}}
				checked={checked}
			/>
			<Field {...fieldProps}>
				{children}
			</Field>
		</label>
	);
};
