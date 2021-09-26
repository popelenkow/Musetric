import React, { useState, ReactNode, FC } from 'react';
import { localizeLocaleId, localizeThemeId } from '../AppBase/Locale';
import { createUseClasses, useCssContext, createClasses } from '../AppContexts/Css';
import { useIconContext } from '../AppContexts/Icon';
import { useLocaleContext } from '../AppContexts/Locale';
import { RootElementProvider, useRootElementContext } from '../AppContexts/RootElement';
import { getButtonClasses } from '../Controls/Button';
import { Switch, SwitchProps } from '../Controls/Switch';
import { AppTitlebar } from './AppTitlebar';

export const getAppClasses = createClasses((css) => {
	const buttonClasses = getButtonClasses(css);
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
		textButton: {
			...buttonClasses.root,
			width: 'auto',
			padding: '0 6px',
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
};
function Root<ViewId>(props: RootProps<ViewId>): JSX.Element {
	const { initViewId, allViewEntries } = props;
	const classes = useClasses();

	const { localeId, setLocaleId, allLocaleIds } = useLocaleContext();
	const { themeId, setThemeId, allThemeIds } = useCssContext();
	const { MenuIcon } = useIconContext();

	const allViewIds = allViewEntries.map((x) => x.viewId);
	const [viewId, setViewId] = useState<ViewId>(initViewId);

	const themeSwitchProps: SwitchProps<string> = {
		currentId: themeId,
		ids: allThemeIds,
		set: (id) => {
			setThemeId(id);
		},
		view: (id, t) => localizeThemeId(id, t) || id,
		className: classes.textButton,
	};

	const localeSwitchProps: SwitchProps<string> = {
		currentId: localeId,
		ids: allLocaleIds,
		set: setLocaleId,
		view: (id, t) => localizeLocaleId(id, t) || id,
		className: classes.textButton,
	};

	const menuSwitchProps: SwitchProps<ViewId> = {
		currentId: viewId,
		ids: allViewIds,
		set: setViewId,
		view: MenuIcon,
	};

	const { viewElement } = allViewEntries.find((x) => x.viewId === viewId) || {};

	const { setRootElement } = useRootElementContext();
	return (
		<div ref={(elem) => elem && setRootElement(elem)} className={classes.root}>
			<AppTitlebar>
				<Switch {...themeSwitchProps} />
				<Switch {...localeSwitchProps} />
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
export function App<ViewId>(props: AppProps<ViewId>): JSX.Element {
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
