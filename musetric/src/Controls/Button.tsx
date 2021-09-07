import React, { FC } from 'react';
import className from 'classnames';
import { createUseClasses, Css } from '../AppContexts/Css';
import { getFieldClasses } from './Field';

export const getButtonClasses = (css: Css) => ({
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
		[css.platform.platformId === 'mobile' ? '&:active' : '&:hover']: {
			background: css.theme.hover,
		},
	},
	disabled: {
		[css.platform.platformId === 'mobile' ? '&:active' : '&:hover']: {
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
	classNames?: {
		root?: string;
		disabled?: string;
	};
};

export const Button: FC<ButtonProps> = (props) => {
	const { children, classNames, onClick, disabled } = props;
	const classes = useButtonClasses();

	const rootName = className({
		[classNames?.root || classes.root]: true,
		[classNames?.disabled || classes.disabled]: disabled,
	});

	return (
		<button type='button' className={rootName} onClick={() => !disabled && onClick()}>
			{children}
		</button>
	);
};
