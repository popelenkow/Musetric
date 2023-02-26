import React, { useState, ReactElement, ReactNode, useEffect, useRef } from 'react';
import { createUseClasses, createClasses } from '../AppContexts/Css';
import { useIconContext } from '../AppContexts/Icon';
import { RootElementProvider, useRootElementContext } from '../AppContexts/RootElement';
import { FCResult } from '../UtilityTypes/React';
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

type AppProps<ViewId> = {
	initViewId: ViewId,
	useViewEntries: () => AppViewEntry<ViewId>[],
	useAppBarButtons: () => ReactElement,
};
type AppFC = (
	<ViewId extends string>(props: AppProps<ViewId>) => FCResult
);
const App: AppFC = (props) => {
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
type AppContextProps<ViewId> = AppProps<ViewId> & {
	providers: AppProviders,
};
type AppContextFC = (
	<ViewId extends string>(props: AppContextProps<ViewId>) => FCResult
);
const AppContext: AppContextFC = (props) => {
	const { providers } = props;

	const arr: AppProvider[] = [
		providers.locale,
		providers.log,
		providers.css,
		providers.icon,
		providers.worker,
		(children): FCResult => {
			return (
				<RootElementProvider>
					{children}
				</RootElementProvider>
			);
		},
	];
	return arr.reduce<ReactElement>((acc, provider) => provider(acc), <App {...props} />);
};

export {
	AppContext as App,
	AppContextProps as AppProps,
};
