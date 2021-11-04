import React, { FC, SetStateAction, Dispatch, ReactElement, useEffect, useRef } from 'react';
import className from 'classnames';
import { useRootElementContext } from '../AppContexts/RootElement';
import { createUseClasses, createClasses } from '../AppContexts/Css';
import { Button, ButtonProps } from './Button';

export const getDropdownClasses = createClasses((css) => {
	const { sidebar, shadow } = css.theme;
	return {
		root: {
			position: 'relative',
			display: 'inline-block',
		},
		menu: {
			display: 'none',
			position: 'absolute',
			right: '0',
			'margin-top': '3px',
			'background-color': sidebar,
			'min-width': '140px',
			'box-shadow': `0px 0px 5px 1px ${shadow}`,
			'z-index': '1',
			padding: '3px',
			'& *': {
				width: '100%',
				'justify-content': 'left',
			},
			'&.open': {
				display: 'block',
			},
		},
	};
});
const useClasses = createUseClasses('Dropdown', getDropdownClasses);

export type DropdownProps = {
	isOpen: boolean;
	setIsOpen: Dispatch<SetStateAction<boolean>>
	kind?: 'simple' | 'icon';
	disabled?: boolean;
	primary?: boolean;
	rounded?: boolean;
	menuWidth?: string;
	renderMenu: () => ReactElement;
};
export const Dropdown: FC<DropdownProps> = (props) => {
	const {
		children, isOpen, setIsOpen, menuWidth, renderMenu,
		kind, disabled, primary, rounded,
	} = props;
	const classes = useClasses();

	const { rootElement } = useRootElementContext();
	const ref = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const closeOnOut = (event: MouseEvent | TouchEvent) => {
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
		const move = (event: KeyboardEvent) => {
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

	const menuName = className({
		[classes.menu]: true,
		open: isOpen,
	});
	const click = () => {
		setIsOpen(!isOpen);
	};

	const buttonProps: ButtonProps = {
		kind,
		disabled,
		primary,
		rounded,
		onClick: () => click(),
	};

	return (
		<div ref={ref} className={classes.root}>
			<Button {...buttonProps}>
				{children}
			</Button>
			<div className={menuName} style={{ width: menuWidth }}>
				{renderMenu()}
			</div>
		</div>
	);
};
