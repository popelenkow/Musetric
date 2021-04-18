import React from 'react';
import classNames from 'classnames';
import { Theme, createUseClasses, getButtonClasses } from '..';

export const getRadioClasses = (theme: Theme) => ({
	root: {
		...getButtonClasses(theme).root,
	},
	disabled: {
		...getButtonClasses(theme).disabled,
	},
	checked: {
		color: theme.color.active,
		'& path, rect, polygon': {
			fill: theme.color.active,
		},
	},
	input: {
		position: 'absolute',
		opacity: '0',
		top: '0',
		left: '0',
	},
});

export const useRadioClasses = createUseClasses('Radio', getRadioClasses);

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
type Props<T extends string> = React.PropsWithChildren<RadioProps<T>>;

export const Radio = <T extends string>(props: Props<T>): JSX.Element => {
	const {
		children, className, classNameDisabled, onSelected,
		disabled, name, value, checkedValue, classNameChecked,
	} = props;
	const classes = useRadioClasses();

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
