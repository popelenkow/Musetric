import React from 'react';
import { createUseStyles } from 'react-jss';
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
		font: '18px/48px "Segoe UI", Arial, sans-serif',
		'border-radius': '21px',
		display: 'flex',
		'justify-content': 'center',
		'align-items': 'center',
		background: 'transparent',
		'&:hover': {
			background: theme.color.hover,
		},
		color: theme.color.content,
		'& path, rect, polygon': {
			fill: theme.color.content,
		},
	},
});

export const useButtonStyles = createUseStyles(getButtonStyles, { name: 'Button', theming });

export type ButtonProps = {
	onClick: () => void;
	className?: string;
	style?: React.CSSProperties;
};

export const Button: React.FC<ButtonProps> = (props) => {
	const { children, className, style, onClick } = props;
	const classes = useButtonStyles();

	return (
		<button type='button' className={className || classes.root} style={style} onClick={onClick}>
			{children}
		</button>
	);
};
