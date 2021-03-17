/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable @typescript-eslint/comma-dangle */
/* eslint-disable max-len */
import React from 'react';
import { createUseStyles } from 'react-jss';
import classNames from 'classnames';
import { getButtonStyles, Theme } from '..';
import { theming } from '../Contexts';

export const getRadioStyles = (theme: Theme) => ({
	root: {
		...getButtonStyles(theme).root,
	},
	disabled: {
		...getButtonStyles(theme).disabled,
	},
	checked: {
		background: theme.color.checked,
	},
	input: {
		position: 'absolute',
		opacity: '0',
		top: '0',
		left: '0',
	},
});

export const useRadioStyles = createUseStyles(getRadioStyles, { name: 'Radio', theming });

export type RadioProps<T extends string> = {
	onSelected: (value: T) => void;
	disabled?: boolean;
	name: string;
	value: T;
	checkedValue: string;
	className?: string;
	classNameDisabled?: string;
	classNameChecked?: string;
};

export const Radio = <T extends string, >(props: React.PropsWithChildren<RadioProps<T>>): JSX.Element => {
	const { children, className, classNameDisabled, onSelected, disabled, name, value, checkedValue, classNameChecked } = props;
	const classes = useRadioStyles();

	const checked = checkedValue === value;
	const rootName = classNames(className || classes.root, {
		[classNameDisabled || classes.disabled]: disabled,
		[classNameChecked || classes.checked]: checked,
	});

	return (
		<label className={rootName}>
			<input className={classes.input} type='radio' name={name} value={value} onChange={(e) => !disabled && onSelected(e.target.value as T)} checked={checked} />
			{children}
		</label>
	);
};