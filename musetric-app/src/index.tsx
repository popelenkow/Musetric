import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Container, Content, App, AppProps, SoundWorkshop, GameOfLife, Titlebar, ContentId, contentIdList, allThemes, themeIdList, localeIdList, createI18n } from 'musetric';
import { main } from './shaders';

const init = async () => {
	const params = new URLSearchParams(window.location.search);

	const initThemeId = params.get('theme') || 'dark';

	const initLocaleId = params.get('locale');
	const i18n = await createI18n(initLocaleId);

	const getIndex = (contentId?: ContentId) => {
		if (!contentId) return -1;
		return contentIdList.indexOf(contentId);
	};

	const appProps: AppProps = {
		i18n,
		localeIdList,
		initThemeId,
		themeIdList,
		allThemes,
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
init;

const canvas = document.createElement('canvas');
canvas.style.width = '100%';
canvas.style.height = '100%';
document.body.appendChild(canvas);
main(canvas);
