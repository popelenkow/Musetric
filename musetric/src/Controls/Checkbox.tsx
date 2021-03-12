/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable @typescript-eslint/comma-dangle */
/* eslint-disable max-len */
import React from 'react';
import { createUseStyles } from 'react-jss';
import classNames from 'classnames';
import { getButtonStyles, Theme } from '..';
import { theming } from '../Contexts';

export const getCheckboxStyles = (theme: Theme) => ({
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

export const useCheckboxStyles = createUseStyles(getCheckboxStyles, { name: 'Checkbox', theming });

export type CheckboxProps = {
	onToggle: () => void;
	checked?: boolean;
	disabled?: boolean;
	className?: string;
	classNameDisabled?: string;
	classNameChecked?: string;
};

export const Checkbox: React.FC<CheckboxProps> = (props) => {
	const { children, className, classNameDisabled, classNameChecked, onToggle, disabled, checked } = props;
	const classes = useCheckboxStyles();

	const rootName = classNames(className || classes.root, {
		[classNameDisabled || classes.disabled]: disabled,
		[classNameChecked || classes.checked]: checked,
	});

	return (
		<label className={rootName}>
			<input className={classes.input} type='checkbox' onChange={() => !disabled && onToggle()} checked={checked} />
			{children}
		</label>
	);
};
