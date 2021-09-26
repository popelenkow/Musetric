import React, { FC } from 'react';
import className from 'classnames';
import { createUseClasses, createClasses } from '../AppContexts/Css';
import { getButtonClasses } from './Button';

export const getCheckboxClasses = createClasses((css) => {
	const buttonClasses = getButtonClasses(css);
	const { active } = css.theme;
	return {
		root: {
			...buttonClasses.root,
		},
		disabled: {
			...buttonClasses.disabled,
		},
		checked: {
			color: active,
			'& path, rect, polygon': {
				fill: active,
			},
		},
		input: {
			position: 'absolute',
			opacity: '0',
			top: '0',
			left: '0',
		},
	};
});
const useClasses = createUseClasses('Checkbox', getCheckboxClasses);

export type CheckboxProps = {
	onToggle: () => void;
	checked?: boolean;
	disabled?: boolean;
	classNames?: {
		root?: string;
		disabled?: string;
		checked?: string;
	};
};
export const Checkbox: FC<CheckboxProps> = (props) => {
	const {
		children, classNames,
		onToggle, disabled, checked,
	} = props;
	const classes = useClasses();

	const rootName = className({
		[classNames?.root || classes.root]: true,
		[classNames?.disabled || classes.disabled]: disabled,
		[classNames?.checked || classes.checked]: checked,
	});

	return (
		<label className={rootName}>
			<input className={classes.input} type='checkbox' onChange={() => !disabled && onToggle()} checked={checked} />
			{children}
		</label>
	);
};
