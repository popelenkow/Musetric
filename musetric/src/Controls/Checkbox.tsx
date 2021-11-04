import React, { FC } from 'react';
import className from 'classnames';
import { createUseClasses, createClasses } from '../AppContexts/Css';
import { getButtonClasses } from './Button';
import { Field, FieldProps } from './Field';

export const getCheckboxClasses = createClasses((css) => {
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
const useClasses = createUseClasses('Checkbox', getCheckboxClasses);

export type CheckboxProps = {
	onToggle: () => void;
	checked?: boolean;
	disabled?: boolean;
	rounded?: boolean;
	classNames?: {
		root?: string;
	};
};
export const Checkbox: FC<CheckboxProps> = (props) => {
	const {
		children, classNames, onToggle,
		disabled, checked, rounded,
	} = props;
	const classes = useClasses();

	const rootName = className({
		[classNames?.root || classes.root]: true,
	});

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
				type='checkbox'
				onChange={() => !disabled && onToggle()}
				checked={checked}
			/>
			<Field {...fieldProps}>
				{children}
			</Field>
		</label>
	);
};
