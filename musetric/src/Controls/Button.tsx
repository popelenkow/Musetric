import React from 'react';
import { createUseStyles } from 'react-jss';
import { Theme, theming } from '..';

export const getButtonStyles = (theme: Theme) => ({
	root: {
		margin: '0',
		padding: '0 12px',
		border: '0',
		outline: '0',
		userSelect: 'none',
		color: theme.content,
		background: 'transparent',
		position: 'relative',
		display: 'flex',
		'justify-content': 'center',
		'align-items': 'center',
		'&:hover': {
			background: 'rgba(128,128,128,.1)',
		},
		'& path, rect, polygon': {
			fill: theme.content,
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
