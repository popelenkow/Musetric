import React, { FC } from 'react';
import className from 'classnames';
import { createUseClasses, createClasses } from '../AppContexts/Css';

export const getFieldClasses = createClasses((css) => {
	const { platformId } = css.platform;
	const { primary: active, content, disabled, divider: splitter } = css.theme;
	return {
		root: {
			font: '18px/24px "Segoe UI", Arial, sans-serif',
			display: 'flex',
			height: '42px',
			'justify-content': 'center',
			'align-items': 'center',
			color: content,
			margin: '0',
			padding: '0 6px',
			border: '1px solid transparent',
			'box-sizing': 'border-box',
			'& path, rect, polygon': {
				fill: content,
			},
			'&.rounded': {
				'border-radius': '10px',
			},
			'&.icon': {
				width: '42px',
			},
			'&:focus-visible': {
				border: `1px solid ${splitter}`,
			},
			'&.disabled': {
				[platformId === 'mobile' ? '&:active' : '&:hover']: {
					background: 'transparent',
				},
				color: disabled,
				'& path, rect, polygon': {
					fill: disabled,
				},
			},
			'&.primary': {
				color: active,
				'& path, rect, polygon': {
					fill: active,
				},
			},
		},
	};
});
const useClasses = createUseClasses('Field', getFieldClasses);

export type FieldProps = {
	kind?: 'simple' | 'icon';
	disabled?: boolean;
	primary?: boolean;
	rounded?: boolean;
	classNames?: {
		root?: string;
	};
};
export const Field: FC<FieldProps> = (props) => {
	const {
		disabled, primary, rounded,
		kind, children, classNames,
	} = props;

	const classes = useClasses();
	const rootName = className({
		[classNames?.root || classes.root]: true,
		icon: kind === 'icon',
		disabled,
		primary,
		rounded,
	});

	return (
		<div className={rootName}>
			{children}
		</div>
	);
};
