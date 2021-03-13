import React from 'react';
import { createUseStyles } from 'react-jss';
import classNames from 'classnames';
import { Theme, theming } from '..';

export const getButtonStyles = (theme: Theme) => ({
	root: {
		margin: '0',
		padding: '0',
		border: '0',
		outline: '0',
		width: '42px',
		height: '42px',
		userSelect: 'none',
		position: 'relative',
		'border-radius': '8px',
		font: '18px/48px "Segoe UI", Arial, sans-serif',
		display: 'flex',
		'justify-content': 'center',
		'align-items': 'center',
		background: 'transparent',
		[theme.platform.id === 'mobile' ? '&:active' : '&:hover']: {
			background: theme.color.hover,
		},
		color: theme.color.content,
		'& path, rect, polygon': {
			fill: theme.color.content,
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

export const useButtonStyles = createUseStyles(getButtonStyles, { name: 'Button', theming });

export type ButtonProps = {
	onClick: () => void;
	disabled?: boolean;
	className?: string;
	classNameDisabled?: string;
};

export const Button: React.FC<ButtonProps> = (props) => {
	const { children, className, classNameDisabled, onClick, disabled } = props;
	const classes = useButtonStyles();

	const rootName = classNames(className || classes.root, {
		[classNameDisabled || classes.disabled]: disabled,
	});

	return (
		<button type='button' className={rootName} onClick={() => !disabled && onClick()}>
			{children}
		</button>
	);
};
