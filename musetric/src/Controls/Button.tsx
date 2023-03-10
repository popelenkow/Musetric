import React, { ButtonHTMLAttributes } from 'react';
import { createUseClasses, createClasses, className } from '../AppContexts/Css';
import { SFC } from '../UtilityTypes/React';

export const getButtonClasses = createClasses((css) => {
	const { theme } = css;
	return {
		root: {
			display: 'flex',
			margin: '0',
			outline: 'none',
			'font-family': 'Verdana, Arial, sans-serif',
			'box-sizing': 'border-box',
			'align-items': 'center',
			height: '42px',
			'min-height': '42px',
			'font-size': '18px',
			padding: '0 6px',
			'background-color': 'transparent',
			'justify-content': 'center',
			border: '1px solid',
			'border-color': 'transparent',
			'user-select': 'none',
			cursor: 'pointer',
			'-webkit-tap-highlight-color': 'transparent',
			color: theme.content,
			'& path, rect, polygon': {
				fill: theme.content,
			},
			'.hoverable &:hover:not(:active)': {
				'background-color': theme.contentHover,
			},
			'&:active': {
				'background-color': theme.contentHoverActive,
			},
			'&.rounded': {
				'border-radius': '10px',
			},
			'&.icon': {
				padding: '0',
				width: '42px',
				'min-width': '42px',
			},
			'&.full': {
				padding: '0 6px',
				width: '100%',
			},
			'&.left': {
				'justify-content': 'left',
			},
			'&.right': {
				'justify-content': 'right',
			},
			'&:focus-visible': {
				'border-color': theme.content,
			},
			'&[disabled]': {
				cursor: 'default',
				'&:active, .hoverable &:hover': {
					'background-color': 'transparent',
				},
				opacity: '0.4',
			},
			'&.primary': {
				color: theme.primary,
				'& path, rect, polygon': {
					fill: theme.primary,
				},
				'.hoverable &:hover:not(:active)': {
					'background-color': theme.primaryHover,
				},
				'&:active': {
					'background-color': theme.primaryHoverActive,
				},
				'&:focus-visible': {
					'border-color': theme.primary,
				},
			},
		},
	};
});
const useClasses = createUseClasses('Button', getButtonClasses);

export type ButtonProps = {
	kind?: 'simple' | 'icon' | 'full',
	align?: 'left' | 'center' | 'right',
	disabled?: boolean,
	primary?: boolean,
	rounded?: boolean,
	title?: string,
	onClick: () => void,
	classNames?: {
		root?: string,
	},
};
export const Button: SFC<ButtonProps, { children: 'required' }> = (props) => {
	const {
		kind, align, disabled, primary, rounded,
		title, onClick, classNames, children,
	} = props;

	const classes = useClasses();
	const rootName = className(
		classNames?.root || classes.root,
		kind ?? 'simple',
		align ?? 'center',
		{ primary, rounded },
	);

	const buttonProps: ButtonHTMLAttributes<HTMLButtonElement> = {
		className: rootName,
		title,
		disabled,
		onClick,
	};

	return (
		<button type='button' {...buttonProps}>
			{children}
		</button>
	);
};
