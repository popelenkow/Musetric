/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable @typescript-eslint/comma-dangle */
/* eslint-disable max-len */
import React from 'react';
import { createUseStyles } from 'react-jss';
import { getButtonStyles, Theme } from '..';
import { theming } from '../Contexts';

export const getRadioButtonStyles = (theme: Theme) => ({
	root: {
		...getButtonStyles(theme).root,
	},
	checked: {
		background: theme.color.checked,
		'border-radius': '21px'
	},
	input: {
		position: 'absolute',
		opacity: '0',
		top: '0',
		left: '0',
	},
});

export const useRadioButtonStyles = createUseStyles(getRadioButtonStyles, { name: 'RadioButton', theming });

export type RadioButtonProps<T extends string> = {
	name: string;
	value: T;
	onSelected: (value: T) => void;
	checkedValue: string;
	className?: string;
	classNameChecked?: string;
};

export const RadioButton = <T extends string, >(props: React.PropsWithChildren<RadioButtonProps<T>>): JSX.Element => {
	const { children, className, name, value, onSelected, checkedValue } = props;
	const classes = useRadioButtonStyles();

	const checked = checkedValue === value;

	return (
		<label className={(className || classes.root) + (checked ? ` ${classes.checked}` : '')}>
			<input className={classes.input} type='radio' name={name} value={value} onChange={(e) => onSelected(e.target.value as T)} checked={checked} />
			{children}
		</label>
	);
};
