import React, { useState, ReactElement, ReactNode, useEffect, useRef } from 'react';
import { createUseClasses, createClasses } from '../AppContexts/Css';
import { useIconContext } from '../AppContexts/Icon';
import { RootElementProvider, useRootElementContext } from '../AppContexts/RootElement';
import { FCResult } from '../UtilityTypes';
import { subscribeDisableZoom } from '../Utils/Zoom';
import { AppBar } from './AppBar';
import { AppDropdown, AppDropdownProps, AppViewEntry, AppViewElement } from './AppDropdown';

export const getAppClasses = createClasses((css) => {
	const { theme } = css;
	return {
		root: {
			position: 'absolute',
			'overscroll-behavior': 'none',
			top: 'var(--screenTop, 0px)',
			height: 'var(--100vh, 100vh)',
			width: '100%',
			'box-sizing': 'border-box',
			display: 'grid',
			'grid-template-rows': ' 50px 1fr',
			'grid-template-columns': '1fr',
			'background-color': theme.background,
		},
	};
});
const useClasses = createUseClasses('App', getAppClasses);

type RootProps<ViewId> = {
	initViewId: ViewId,
	useViewEntries: () => AppViewEntry<ViewId>[],
	useAppBarButtons: () => ReactElement,
};
type RootFC = (
	<ViewId extends string>(props: RootProps<ViewId>) => FCResult
);
const Root: RootFC = (props) => {
	type ViewId = (typeof props)['initViewId'];
	const { initViewId, useViewEntries, useAppBarButtons } = props;
	const classes = useClasses();
	const { MenuIcon } = useIconContext();

	const allViewEntries = useViewEntries();
	const { rootElement, setRootElement } = useRootElementContext();
	useEffect(() => subscribeDisableZoom(rootElement), [rootElement]);

	const rootElementRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (rootElementRef.current) setRootElement(rootElementRef.current);
	}, [setRootElement]);

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
		<div ref={rootElementRef} className={classes.root}>
			<AppBar>
				{buttons}
				<AppDropdown {...appDropdownProps}><MenuIcon /></AppDropdown>
			</AppBar>
			{element}
		</div>
	);
};

export type AppProvider = (children: ReactNode) => FCResult;
export type AppProviders = {
	locale: AppProvider,
	log: AppProvider,
	css: AppProvider,
	icon: AppProvider,
	worker: AppProvider,
};
export type AppProps<ViewId> = {
	providers: AppProviders,
} & RootProps<ViewId>;
type AppFC = (
	<ViewId extends string>(props: AppProps<ViewId>) => FCResult
);
export const App: AppFC = (props) => {
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
	return arr.reduce<ReactElement>((acc, provider) => provider(acc), root);
};
