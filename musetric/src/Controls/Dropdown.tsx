import React, { SetStateAction, Dispatch, ReactElement, useEffect, useRef } from 'react';
import { createUseClasses, createClasses, className } from '../AppContexts/Css';
import { useRootElementContext } from '../AppContexts/RootElement';
import { SFC } from '../UtilityTypes';
import { Button, ButtonProps } from './Button';

export const getDropdownClasses = createClasses((css) => {
	const { theme } = css;
	return {
		root: {
			position: 'relative',
			display: 'inline-block',
		},
		menu: {
			display: 'none',
			position: 'absolute',
			'z-index': '2',
			right: '0',
			'margin-top': '3px',
			'background-color': theme.activeBackground,
			'min-width': '140px',
			'box-shadow': `0px 0px 5px 1px ${theme.shadow}`,
			'&.open': {
				display: 'block',
			},
		},
	};
});
const useClasses = createUseClasses('Dropdown', getDropdownClasses);

export type DropdownProps = {
	kind?: 'simple' | 'icon' | 'full',
	align?: 'left' | 'center' | 'right',
	disabled?: boolean,
	active?: boolean,
	primary?: boolean,
	rounded?: boolean,
	title?: string,
	isOpen: boolean,
	setIsOpen: Dispatch<SetStateAction<boolean>>,
	menu: {
		render: () => ReactElement,
		width?: string,
	},
};
export const Dropdown: SFC<DropdownProps, 'required'> = (props) => {
	const {
		kind, disabled, active, primary, rounded,
		title, isOpen, setIsOpen, menu, children,
	} = props;
	const classes = useClasses();

	const { rootElement } = useRootElementContext();
	const ref = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const closeOnOut = (event: MouseEvent | TouchEvent): void => {
			if (!ref.current) return;
			const { target } = event;
			if (!target || !(target instanceof Node)) return;
			if (ref.current.contains(target)) return;
			setIsOpen(false);
		};
		rootElement.addEventListener('mousedown', closeOnOut);
		rootElement.addEventListener('touchstart', closeOnOut);
		return () => {
			rootElement.removeEventListener('mousedown', closeOnOut);
			rootElement.removeEventListener('touchstart', closeOnOut);
		};
	}, [rootElement, setIsOpen]);
	useEffect(() => {
		const move = (event: KeyboardEvent): void => {
			const keys = ['ArrowDown', 'ArrowUp', 'Escape'];
			if (keys.some((x) => event.key === x)) {
				event.stopPropagation();
				event.preventDefault();
				if (event.key === 'Escape') {
					setIsOpen(false);
				}
			}
		};
		rootElement.addEventListener('keydown', move);
		return () => {
			rootElement.removeEventListener('keydown', move);
		};
	}, [rootElement, setIsOpen]);

	const menuName = className(
		classes.menu,
		{ open: isOpen },
	);
	const click = (): void => {
		setIsOpen(!isOpen);
	};

	const buttonProps: ButtonProps = {
		kind,
		active,
		disabled,
		primary,
		rounded,
		title,
		onClick: () => click(),
	};

	return (
		<div ref={ref} className={classes.root}>
			<Button {...buttonProps}>
				{children}
			</Button>
			<div className={menuName} style={{ width: menu.width }}>
				{menu.render()}
			</div>
		</div>
	);
};
