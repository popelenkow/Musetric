import React, { PropsWithChildren } from 'react';
import className from 'classnames';
import { createUseClasses, Css } from '../AppContexts/Css';
import { getButtonClasses } from './Button';

export const getRadioClasses = (css: Css) => ({
	root: {
		...getButtonClasses(css).root,
	},
	disabled: {
		...getButtonClasses(css).disabled,
	},
	checked: {
		color: css.theme.active,
		'& path, rect, polygon': {
			fill: css.theme.active,
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
	label: string;
	value: T;
	checkedValue: T;
	classNames?: {
		root?: string;
		disabled?: string;
		checked?: string;
	};
};
type Props<T extends string> = PropsWithChildren<RadioProps<T>>;

export const Radio = <T extends string>(props: Props<T>): JSX.Element => {
	const {
		children, classNames, onSelected,
		disabled, label, value, checkedValue,
	} = props;
	const classes = useRadioClasses();

	const checked = checkedValue === value;
	const rootName = className({
		[classNames?.root || classes.root]: true,
		[classNames?.disabled || classes.disabled]: disabled,
		[classNames?.checked || classes.checked]: checked,
	});

	return (
		<label className={rootName}>
			<input className={classes.input} type='radio' name={label} value={value} onChange={(e) => !disabled && onSelected(e.target.value as T)} checked={checked} />
			{children}
		</label>
	);
};
