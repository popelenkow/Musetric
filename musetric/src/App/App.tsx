import React, { useState, FC, ReactElement } from 'react';
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
			'grid-template-rows': '48px 1fr',
			'grid-template-columns': '1fr',
		},
	};
});
const useClasses = createUseClasses('App', getAppClasses);

type RootProps<ViewId extends string> = {
	initViewId: ViewId;
	useViewEntries: () => AppViewEntry<ViewId>[];
	AppBarButtons: FC;
};
function Root<ViewId extends string>(props: RootProps<ViewId>): ReactElement | null {
	const { initViewId, useViewEntries, AppBarButtons } = props;
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

	return (
		<div ref={(elem) => elem && setRootElement(elem)} className={classes.root}>
			<AppBar>
				<AppBarButtons />
				<AppDropdown {...appDropdownProps}><MenuIcon /></AppDropdown>
			</AppBar>
			{element}
		</div>
	);
}

export type AppProps<ViewId extends string> = {
	LocaleProvider: FC;
	CssProvider: FC;
	IconProvider: FC;
	WorkerProvider: FC;
} & RootProps<ViewId>;
export function App<ViewId extends string>(props: AppProps<ViewId>): ReactElement | null {
	const { LocaleProvider, CssProvider, IconProvider, WorkerProvider } = props;

	return (
		<LocaleProvider>
			<CssProvider>
				<IconProvider>
					<WorkerProvider>
						<RootElementProvider>
							<Root {...props} />
						</RootElementProvider>
					</WorkerProvider>
				</IconProvider>
			</CssProvider>
		</LocaleProvider>
	);
}
