import React, { FC } from 'react';
import className from 'classnames';
import { createUseClasses, createClasses } from '../AppContexts/Css';
import { getFieldClasses } from './Field';

export const getButtonClasses = createClasses((css) => {
	const fieldClasses = getFieldClasses(css);
	const { platformId } = css.platform;
	const { hover } = css.theme;
	return {
		root: {
			...fieldClasses.root,
			outline: '0',
			'user-select': 'none',
			position: 'relative',
			background: 'transparent',
			[platformId === 'mobile' ? '&:active' : '&:hover']: {
				background: hover,
			},
		},
	};
});
const useClasses = createUseClasses('Button', getButtonClasses);

export type ButtonProps = {
	onClick: () => void;
	kind?: 'simple' | 'icon';
	disabled?: boolean;
	primary?: boolean;
	rounded?: boolean;
	classNames?: {
		root?: string;
	};
};
export const Button: FC<ButtonProps> = (props) => {
	const {
		onClick, children, classNames,
		kind, disabled, primary, rounded,
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
		<button type='button' className={rootName} onClick={() => !disabled && onClick()}>
			{children}
		</button>
	);
};
