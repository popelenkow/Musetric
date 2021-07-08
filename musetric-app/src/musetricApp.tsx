/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import {
	App, AppProps, SoundWorkshop,
	allThemes, allThemeIds, getStorageThemeId, setStorageThemeId,
	localeIdList, createI18n, getStorageLocaleId, setStorageLocaleId,
} from 'musetric';
import { CreateMusetricApp } from './types';

export const createMusetricApp: CreateMusetricApp = async (elementId: string) => {
	const initThemeId = getStorageThemeId();
	const initLocaleId = getStorageLocaleId();
	const i18n = await createI18n(initLocaleId);

	const appProps: AppProps = {
		i18n,
		localeIdList,
		onSetLocaleId: setStorageLocaleId,
		initThemeId,
		allThemeIds,
		allThemes,
		onSetThemeId: setStorageThemeId,
	};

	const app = (
		<Suspense fallback='loading'>
			<App {...appProps}>
				<SoundWorkshop />
			</App>
		</Suspense>
	);
	const root = document.getElementById(elementId);
	ReactDOM.render(app, root);
};
