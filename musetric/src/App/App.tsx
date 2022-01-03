import React, { useState, ReactElement, ReactNode } from 'react';
import { createUseClasses, createClasses } from '../AppContexts/Css';
import { useIconContext } from '../AppContexts/Icon';
import { RootElementProvider, useRootElementContext } from '../AppContexts/RootElement';
import { useDisabledZoom } from '../Hooks/DisabledZoom';
import { AppBar } from './AppBar';
import { AppDropdown, AppDropdownProps, AppViewEntry, AppViewElement } from './AppDropdown';

export const getAppClasses = createClasses((css) => {
	const { width, height } = css.platform;
	return {
		root: {
			'box-sizing': 'border-box',
			width,
			height,
			display: 'grid',
			'grid-template-rows': '50px 1fr',
			'grid-template-columns': '1fr',
		},
	};
});
const useClasses = createUseClasses('App', getAppClasses);

type RootProps<ViewId extends string> = {
	initViewId: ViewId;
	useViewEntries: () => AppViewEntry<ViewId>[];
	useAppBarButtons: () => ReactElement;
};
function Root<ViewId extends string>(props: RootProps<ViewId>): ReactElement | null {
	const { initViewId, useViewEntries, useAppBarButtons } = props;
	const classes = useClasses();
	const { MenuIcon } = useIconContext();

	const allViewEntries = useViewEntries();
	const { rootElement, setRootElement } = useRootElementContext();
	useDisabledZoom(rootElement);

	const [viewId, setViewId] = useState<ViewId>(initViewId);
	const appDropdownProps: AppDropdownProps<ViewId> = {
		viewId,
		setViewId,
		allViewEntries,
	};

	const { element } = allViewEntries
		.filter((x): x is AppViewElement<ViewId> => x.type === 'view')
		.find((view) => view.id === viewId) || {};

	const buttons = useAppBarButtons();
	return (
		<div ref={(elem) => elem && setRootElement(elem)} className={classes.root}>
			<AppBar>
				{buttons}
				<AppDropdown {...appDropdownProps}><MenuIcon /></AppDropdown>
			</AppBar>
			{element}
		</div>
	);
}

export type AppProvider = (children?: ReactNode) => ReactElement | null;
export type AppProviders = {
	locale: AppProvider;
	log: AppProvider;
	css: AppProvider;
	icon: AppProvider;
	worker: AppProvider;
};
export type AppProps<ViewId extends string> = {
	providers: AppProviders;
} & RootProps<ViewId>;
export function App<ViewId extends string>(props: AppProps<ViewId>): ReactElement | null {
	const { providers } = props;
	const root = (
		<RootElementProvider>
			<Root {...props} />
		</RootElementProvider>
	);
	const arr = [
		providers.locale,
		providers.log,
		providers.css,
		providers.icon,
		providers.worker,
	];
	return arr.reduce<ReactElement | null>((acc, provider) => provider(acc), root);
}
