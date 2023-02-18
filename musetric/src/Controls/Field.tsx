import React from 'react';
import { createUseClasses, createClasses, className } from '../AppContexts/Css';
import { SFC } from '../UtilityTypes';

export const getFieldClasses = createClasses((css) => {
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
			padding: '0 6px',
			'background-color': 'transparent',
			height: '42px',
			'min-height': '42px',
			'font-size': '18px',
			'justify-content': 'center',
			border: '1px solid',
			'border-color': 'transparent',
			color: theme.activeContent,
			'& path, rect, polygon': {
				fill: theme.activeContent,
			},
			'&:focus-visible': {
				'border-color': theme.divider,
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
			'&.disabled': {
				[platformId === 'mobile' ? '&:active' : '&:hover']: {
					'background-color': theme.hover,
				},
				opacity: '0.4',
			},
			'&.primary': {
				color: theme.primary,
				'& path, rect, polygon': {
					fill: theme.primary,
				},
			},
		},
	};
});
const useClasses = createUseClasses('Field', getFieldClasses);

export type FieldProps = {
	kind?: 'simple' | 'icon' | 'full',
	align?: 'left' | 'center' | 'right',
	disabled?: boolean,
	primary?: boolean,
	rounded?: boolean,
	classNames?: {
		root?: string,
	},
};
export const Field: SFC<FieldProps, 'required'> = (props) => {
	const {
		disabled, primary, rounded,
		kind, align, children, classNames,
	} = props;

	const classes = useClasses();
	const rootName = className(
		classNames?.root || classes.root,
		{ value: kind, default: 'simple' },
		{ value: align, default: 'center' },
		{ value: { disabled, primary, rounded } },
	);

	return (
		<div className={rootName}>
			{children}
		</div>
	);
};
