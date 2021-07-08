import React from 'react';
import classNames from 'classnames';
import { AppCss, createUseClasses, getFieldClasses } from '..';

export const getButtonClasses = (css: AppCss) => ({
	root: {
		...getFieldClasses(css).root,
		margin: '0',
		padding: '0',
		border: '0',
		outline: '0',
		width: '42px',
		height: '42px',
		'user-select': 'none',
		position: 'relative',
		'border-radius': '10px',
		background: 'transparent',
		[css.platform.id === 'mobile' ? '&:active' : '&:hover']: {
			background: css.theme.hover,
		},
	},
	disabled: {
		[css.platform.id === 'mobile' ? '&:active' : '&:hover']: {
			background: 'transparent',
		},
		color: css.theme.disabled,
		'& path, rect, polygon': {
			fill: css.theme.disabled,
		},
	},
});

export const useButtonClasses = createUseClasses('Button', getButtonClasses);

export type ButtonProps = {
	onClick: () => void;
	disabled?: boolean;
	className?: string;
	classNameDisabled?: string;
};

export const Button: React.FC<ButtonProps> = (props) => {
	const { children, className, classNameDisabled, onClick, disabled } = props;
	const classes = useButtonClasses();

	const rootName = classNames(className || classes.root, {
		[classNameDisabled || classes.disabled]: disabled,
	});

	return (
		<button type='button' className={rootName} onClick={() => !disabled && onClick()}>
			{children}
		</button>
	);
};
