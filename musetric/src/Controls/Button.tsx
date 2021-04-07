import React from 'react';
import classNames from 'classnames';
import { Theme, createUseClasses, getFieldClasses } from '..';

export const getButtonClasses = (theme: Theme) => ({
	root: {
		...getFieldClasses(theme).root,
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
		[theme.platform.id === 'mobile' ? '&:active' : '&:hover']: {
			background: theme.color.hover,
		},
	},
	disabled: {
		[theme.platform.id === 'mobile' ? '&:active' : '&:hover']: {
			background: 'transparent',
		},
		color: theme.color.disabled,
		'& path, rect, polygon': {
			fill: theme.color.disabled,
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
