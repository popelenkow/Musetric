import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { App, AppProps, SoundWorkshop, allColorThemes, allColorThemeIds, localeIdList, createI18n } from 'musetric';

const init = async () => {
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
	const root = document.createElement('div');
	document.body.appendChild(root);
	ReactDOM.render(app, root);
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
init();
