import React, { FC, ButtonHTMLAttributes } from 'react';
import { createUseClasses, createClasses, className } from '../AppContexts/Css';
import { WithChildren } from '../ReactUtils/WithChildren';

export const getButtonClasses = createClasses((css) => {
	const { theme } = css;
	const { platformId } = css.platform;
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
			[platformId === 'mobile' ? '&:active' : '&:hover']: {
				'background-color': theme.hover,
				color: theme.activeContent,
				'& path, rect, polygon': {
					fill: theme.activeContent,
				},
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
				'border-color': theme.activeContent,
				color: theme.activeContent,
				'& path, rect, polygon': {
					fill: theme.activeContent,
				},
			},
			'&[disabled]': {
				cursor: 'default',
				[platformId === 'mobile' ? '&:active' : '&:hover']: {
					color: theme.content,
					'&.active': {
						color: theme.activeContent,
						'& path, rect, polygon': {
							fill: theme.activeContent,
						},
					},
					'&.primary': {
						color: theme.primary,
						'& path, rect, polygon': {
							fill: theme.primary,
						},
						'&.active': {
							color: theme.activePrimary,
							'& path, rect, polygon': {
								fill: theme.activePrimary,
							},
						},
					},
					'& path, rect, polygon': {
						fill: theme.content,
					},
					'background-color': 'transparent',
				},
				opacity: '0.4',
			},
			'&.active': {
				color: theme.activeContent,
				'& path, rect, polygon': {
					fill: theme.activeContent,
				},
			},
			'&.primary': {
				color: theme.primary,
				'& path, rect, polygon': {
					fill: theme.primary,
				},
				'&.active': {
					color: theme.activePrimary,
					'& path, rect, polygon': {
						fill: theme.activePrimary,
					},
				},
				[platformId === 'mobile' ? '&:active' : '&:hover']: {
					'background-color': theme.primaryHover,
					color: theme.activePrimary,
					'& path, rect, polygon': {
						fill: theme.activePrimary,
					},
				},
				'&:focus-visible': {
					'border-color': theme.activePrimary,
					color: theme.activePrimary,
					'& path, rect, polygon': {
						fill: theme.activePrimary,
					},
				},
			},
		},
	};
});
const useClasses = createUseClasses('Button', getButtonClasses);

export type ButtonProps = {
	kind?: 'simple' | 'icon' | 'full';
	align?: 'left' | 'center' | 'right';
	disabled?: boolean;
	active?: boolean;
	primary?: boolean;
	rounded?: boolean;
	title?: string;
	onClick: () => void;
	classNames?: {
		root?: string;
	};
};
export const Button: FC<WithChildren<ButtonProps>> = (props) => {
	const {
		kind, align, disabled, active, primary, rounded,
		title, onClick, classNames, children,
	} = props;

	const classes = useClasses();
	const rootName = className(
		classNames?.root || classes.root,
		{ value: kind, default: 'simple' },
		{ value: align, default: 'center' },
		{ value: { active, primary, rounded } },
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
