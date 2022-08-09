import React, { ReactNode, SetStateAction, Dispatch, useState, ReactElement } from 'react';
import { useIconContext } from '../AppContexts/Icon';
import { useLocaleContext } from '../AppContexts/Locale';
import { Button, ButtonProps } from '../Controls/Button';
import { Divider } from '../Controls/Divider';
import { Dropdown, DropdownProps } from '../Controls/Dropdown';

export type AppViewDivider = {
	type: 'divider',
};
export type AppViewElement<ViewId extends string> = {
	type: 'view',
	id: ViewId,
	name: string,
	element: ReactNode,
};
export type AppViewEntry<ViewId extends string> = AppViewDivider | AppViewElement<ViewId>;
function f() {
}
f();
export type AppDropdownProps<ViewId extends string> = {
	viewId: ViewId,
	setViewId: Dispatch<SetStateAction<ViewId>>,
	allViewEntries: AppViewEntry<ViewId>[],
};
export function AppDropdown<ViewId extends string>(props: AppDropdownProps<ViewId>): ReactElement {
	const { viewId, setViewId, allViewEntries } = props;
	const { MenuIcon } = useIconContext();
	const { i18n } = useLocaleContext();

	const [isOpen, setIsOpen] = useState<boolean>(false);
	const mapMenu = (view: AppViewEntry<ViewId>, index: number): ReactElement | null => {
		if (view.type === 'divider') {
			return <Divider key={`app-divider-${index}`} />;
		}
		if (view.type === 'view') {
			const onClick = () => {
				setViewId(view.id);
				setIsOpen(false);
			};
			const key = `app-${view.id}`;
			const active = viewId === view.id;
			const buttonProps: ButtonProps = {
				onClick,
				kind: 'full',
				align: 'left',
				active,
				primary: active,
			};
			return (
				<Button key={key} {...buttonProps}>
					{view.name}
				</Button>
			);
		}
		return null;
	};
	const renderMenu = () => <>{allViewEntries.map(mapMenu)}</>;
	const dropdownProps: DropdownProps = {
		kind: 'icon',
		active: isOpen,
		rounded: true,
		title: i18n.t('AppBase:dropdown'),
		isOpen,
		setIsOpen,
		menu: {
			render: renderMenu,
			width: '200px',
		},
	};

	return (
		<Dropdown {...dropdownProps}><MenuIcon /></Dropdown>
	);
}
