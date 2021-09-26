import React, { FC } from 'react';
import className from 'classnames';
import { createUseClasses, createClasses } from '../AppContexts/Css';
import { getFieldClasses } from './Field';

export const getButtonClasses = createClasses((css) => {
	const fieldClasses = getFieldClasses(css);
	const { platformId } = css.platform;
	const { hover, disabled } = css.theme;
	return {
		root: {
			...fieldClasses.root,
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
			[platformId === 'mobile' ? '&:active' : '&:hover']: {
				background: hover,
			},
		},
		disabled: {
			[platformId === 'mobile' ? '&:active' : '&:hover']: {
				background: 'transparent',
			},
			color: disabled,
			'& path, rect, polygon': {
				fill: disabled,
			},
		},
	};
});
const useClasses = createUseClasses('Button', getButtonClasses);

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
	const classes = useClasses();

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
