import React, { ReactNode, SetStateAction, Dispatch, useState, ReactElement } from 'react';
import { useIconContext } from '../AppContexts/Icon';
import { Button, ButtonProps } from '../Controls/Button';
import { Divider } from '../Controls/Divider';
import { Dropdown, DropdownProps } from '../Controls/Dropdown';

export type AppViewDivider = {
	type: 'divider';
};
export type AppViewElement<ViewId extends string> = {
	type: 'view'
	id: ViewId;
	name: string;
	element: ReactNode;
};
export type AppViewEntry<ViewId extends string> = AppViewDivider | AppViewElement<ViewId>;

export type AppDropdownProps<ViewId extends string> = {
	viewId: ViewId;
	setViewId: Dispatch<SetStateAction<ViewId>>;
	allViewEntries: AppViewEntry<ViewId>[];
};
export function AppDropdown<ViewId extends string>(
	props: AppDropdownProps<ViewId>,
): ReactElement | null {
	const { viewId, setViewId, allViewEntries } = props;
	const { MenuIcon } = useIconContext();

	const [isOpen, setIsOpen] = useState<boolean>(false);
	const mapMenu = (view: AppViewEntry<ViewId>, index: number): ReactElement | null => {
		if (view.type === 'divider') {
			return <Divider key={`app-${index}`} />;
		}
		if (view.type === 'view') {
			const onClick = () => {
				setViewId(view.id);
				setIsOpen(false);
			};
			const buttonProps: ButtonProps = {
				onClick,
				primary: viewId === view.id,
				rounded: true,
			};
			return (
				<Button key={`app-${index}`} {...buttonProps}>
					{view.name}
				</Button>
			);
		}
		return null;
	};
	const renderMenu = () => <>{allViewEntries.map(mapMenu)}</>;
	const menuSwitchProps: DropdownProps = {
		isOpen,
		setIsOpen,
		kind: 'icon',
		rounded: true,
		menuWidth: '200px',
		renderMenu,
	};

	return (
		<Dropdown {...menuSwitchProps}><MenuIcon /></Dropdown>
	);
}
