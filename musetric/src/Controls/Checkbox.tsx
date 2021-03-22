/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable @typescript-eslint/comma-dangle */
/* eslint-disable max-len */
import React from 'react';
import classNames from 'classnames';
import { Theme, createUseClasses, getButtonClasses } from '..';

export const getCheckboxClasses = (theme: Theme) => ({
	root: {
		...getButtonClasses(theme).root,
	},
	disabled: {
		...getButtonClasses(theme).disabled,
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

export const useCheckboxClasses = createUseClasses('Checkbox', getCheckboxClasses);

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
	const classes = useCheckboxClasses();

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
