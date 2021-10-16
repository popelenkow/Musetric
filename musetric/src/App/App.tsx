import React, { useState, ReactNode, FC, useEffect } from 'react';
import { createUseClasses, createClasses } from '../AppContexts/Css';
import { useIconContext } from '../AppContexts/Icon';
import { RootElementProvider, useRootElementContext } from '../AppContexts/RootElement';
import { Switch, SwitchProps } from '../Controls/Switch';
import { AppTitlebar } from './AppTitlebar';

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

export type AppViewEntry<ViewId> = {
	viewId: ViewId;
	viewElement: ReactNode;
};

type RootProps<ViewId> = {
	initViewId: ViewId;
	allViewEntries: AppViewEntry<ViewId>[];
	TitlebarButtons: FC;
};
function Root<ViewId>(props: RootProps<ViewId>): React.ReactElement | null {
	const { initViewId, allViewEntries, TitlebarButtons } = props;
	const classes = useClasses();

	const { MenuIcon } = useIconContext();

	const allViewIds = allViewEntries.map((x) => x.viewId);
	const [viewId, setViewId] = useState<ViewId>(initViewId);

	const menuSwitchProps: SwitchProps<ViewId> = {
		currentId: viewId,
		ids: allViewIds,
		set: setViewId,
		view: MenuIcon,
	};

	const { viewElement } = allViewEntries.find((x) => x.viewId === viewId) || {};

	const { rootElement, setRootElement } = useRootElementContext();
	useEffect(() => {
		if (!rootElement) return undefined;
		const keydownListener = (event: KeyboardEvent) => {
			const keys = ['-', '+', '=', '_'];
			if (event.ctrlKey === true && keys.some((x) => event.key === x)) {
				event.preventDefault();
			}
		};
		const wheelListener = (event: WheelEvent) => {
			if (event.ctrlKey === true) {
				event.preventDefault();
			}
		};
		document.body.addEventListener('keydown', keydownListener);
		rootElement.addEventListener('wheel', wheelListener);
		return () => {
			document.body.removeEventListener('keydown', keydownListener);
			rootElement.removeEventListener('wheel', wheelListener);
		};
	}, [rootElement]);

	return (
		<div ref={(elem) => elem && setRootElement(elem)} className={classes.root}>
			<AppTitlebar>
				<TitlebarButtons />
				<Switch {...menuSwitchProps} />
			</AppTitlebar>
			{viewElement}
		</div>
	);
}

export type AppProps<ViewId> = {
	LocaleProvider: FC;
	CssProvider: FC;
	IconProvider: FC;
	WorkerProvider: FC;
} & RootProps<ViewId>;
export function App<ViewId>(props: AppProps<ViewId>): React.ReactElement | null {
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
