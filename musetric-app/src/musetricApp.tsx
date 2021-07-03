/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { App, AppProps, SoundWorkshop, allColorThemes, allColorThemeIds, localeIdList, createI18n } from 'musetric';
import { CreateMusetricApp } from './types';

export const createMusetricApp: CreateMusetricApp = async (elementId: string) => {
	const params = new URLSearchParams(window.location.search);

	const initColorThemeId = params.get('theme') || 'dark';

	const initLocaleId = params.get('locale');
	const i18n = await createI18n(initLocaleId);

	const appProps: AppProps = {
		i18n,
		localeIdList,
		initColorThemeId,
		allColorThemeIds,
		allColorThemes,
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
