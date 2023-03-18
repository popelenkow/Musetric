import React, { ReactNode, SetStateAction, Dispatch, useState, ReactElement } from 'react';
import { Button, ButtonProps } from '../Controls/Button';
import { Divider } from '../Controls/Divider';
import { Dropdown, DropdownProps } from '../Controls/Dropdown';
import { Icon } from '../Controls/Icon';
import { FCResult } from '../UtilityTypes/React';
import { useAppLocale } from './AppContext';

export type AppViewDivider = {
	type: 'divider',
};
export type AppViewElement<ViewId> = {
	type: 'view',
	id: ViewId,
	name: string,
	element: ReactNode,
};
export type AppViewEntry<ViewId> = AppViewDivider | AppViewElement<ViewId>;

export type AppDropdownProps<ViewId> = {
	viewId: ViewId,
	setViewId: Dispatch<SetStateAction<ViewId>>,
	allViewEntries: AppViewEntry<ViewId>[],
};
type AppDropdownFC = (
	<ViewId extends string>(props: AppDropdownProps<ViewId>) => FCResult
);
export const AppDropdown: AppDropdownFC = (props) => {
	type ViewId = (typeof props)['viewId'];
	const { viewId, setViewId, allViewEntries } = props;
	const { i18n } = useAppLocale();

	const [isOpen, setIsOpen] = useState<boolean>(false);
	const mapMenu = (view: AppViewEntry<ViewId>, index: number): ReactElement | null => {
		if (view.type === 'divider') {
			return <Divider key={`app-divider-${index}`} />;
		}
		if (view.type === 'view') {
			const onClick = (): void => {
				setViewId(view.id);
				setIsOpen(false);
			};
			const key = `app-${view.id}`;
			const buttonProps: ButtonProps = {
				onClick,
				kind: 'full',
				align: 'left',
				primary: viewId === view.id,
			};
			return (
				<Button key={key} {...buttonProps}>
					{view.name}
				</Button>
			);
		}
		return null;
	};
	const renderMenu = (): ReactElement => <>{allViewEntries.map(mapMenu)}</>;
	const dropdownProps: DropdownProps = {
		kind: 'icon',
		primary: isOpen,
		rounded: true,
		title: i18n.t('AppBase:dropdown'),
		isOpen,
		setIsOpen,
		menu: {
			render: renderMenu,
			width: '220px',
		},
	};

	return (
		<Dropdown {...dropdownProps}><Icon name='menu' /></Dropdown>
	);
};
