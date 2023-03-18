import { App, AppProps } from 'musetric/App/App';
import { getStorageLocaleId, setStorageLocaleId, createI18n } from 'musetric/AppBase/Locale';
import type { LocaleEntry } from 'musetric/AppBase/Locale';
import { createConsoleLog } from 'musetric/AppBase/Log';
import { getStorageThemeId, setStorageThemeId } from 'musetric/AppBase/Theme';
import type { ThemeEntry } from 'musetric/AppBase/Theme';
import type { Workers } from 'musetric/AppBase/Worker';
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { useAppBarButtons } from './common/AppBarButtons';
import { ViewId, useViewEntries } from './common/ViewEntries';

export type CreateMusetricAppOptions = {
	elementId: string,
	allLocaleEntries: LocaleEntry[],
	allThemeEntries: ThemeEntry[],
	apiUrl: string,
	workers: Workers,
};
export type CreateMusetricApp = (options: CreateMusetricAppOptions) => Promise<void>;
export const createMusetricApp: CreateMusetricApp = async (options) => {
	const { elementId, allLocaleEntries, allThemeEntries, apiUrl, workers } = options;

	const initLocaleId = getStorageLocaleId() || 'en';
	const i18n = await createI18n(initLocaleId, allLocaleEntries);

	const log = createConsoleLog();
	const initThemeId = getStorageThemeId() || 'dark';

	const appProps: AppProps<ViewId> = {
		useAppBarButtons,
		initViewId: 'soundWorkshop',
		useViewEntries,
		workers,
		log,
		i18n,
		allLocaleIds: allLocaleEntries.map((x) => x.localeId),
		onLocaleId: setStorageLocaleId,
		initThemeId,
		allThemeEntries,
		onSetThemeId: setStorageThemeId,
		apiUrl,
	};

	const rootElement = document.getElementById(elementId);
	if (!rootElement) throw new Error();
	const root = createRoot(rootElement);
	root.render(<StrictMode><App {...appProps} /></StrictMode>);
};
