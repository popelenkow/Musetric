import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Container, Content, App, AppProps, SoundWorkshop, GameOfLife, Titlebar, ContentId, contentIdList, allColorThemes, allColorThemeIds, localeIdList, createI18n } from 'musetric';

const init = async () => {
	const params = new URLSearchParams(window.location.search);

	const initColorThemeId = params.get('theme') || 'dark';

	const initLocaleId = params.get('locale');
	const i18n = await createI18n(initLocaleId);

	const getIndex = (contentId?: ContentId) => {
		if (!contentId) return -1;
		return contentIdList.indexOf(contentId);
	};

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
				<Titlebar />
				<Container>
					<Content getIndex={getIndex}>
						<SoundWorkshop />
						<GameOfLife size={{ columns: 50, rows: 50 }} />
					</Content>
				</Container>
			</App>
		</Suspense>
	);
	const root = document.createElement('div');
	root.style.height = '100%';
	root.style.width = '100%';
	document.body.appendChild(root);
	ReactDOM.render(app, root);
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
init();
