import React, { PropsWithChildren } from 'react';
import className from 'classnames';
import { createUseClasses, createClasses } from '../AppContexts/Css';
import { getButtonClasses } from './Button';
import { Field, FieldProps } from './Field';

export const getRadioClasses = createClasses((css) => {
	const buttonClasses = getButtonClasses(css);
	const { divider: splitter } = css.theme;
	return {
		root: {
			display: 'block',
		},
		input: {
			position: 'absolute',
			opacity: '0',
			'&:focus-visible + *': {
				border: `1px solid ${splitter}`,
			},
		},
		button: {
			...buttonClasses.root,
		},
	};
});
const useClasses = createUseClasses('Radio', getRadioClasses);

export type RadioProps<T extends string> = {
	onSelected: (value: T) => void;
	disabled?: boolean;
	rounded?: boolean;
	label: string;
	value: T;
	checkedValue: T;
	classNames?: {
		root?: string;
	};
};
type Props<T extends string> = PropsWithChildren<RadioProps<T>>;

export const Radio = <T extends string>(props: Props<T>): JSX.Element => {
	const {
		children, classNames, onSelected,
		disabled, rounded, label, value, checkedValue,
	} = props;
	const classes = useClasses();

	const rootName = className({
		[classNames?.root || classes.root]: true,
	});

	const checked = checkedValue === value;
	const fieldProps: FieldProps = {
		kind: 'icon',
		disabled,
		rounded,
		primary: checked,
		classNames: { root: classes.button },
	};

	return (
		<label className={rootName}>
			<input
				className={classes.input}
				type='radio'
				name={label}
				value={value}
				onChange={(e) => !disabled && onSelected(e.target.value as T)}
				checked={checked}
			/>
			<Field {...fieldProps}>
				{children}
			</Field>
		</label>
	);
};
