import './index.scss';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Container, Content } from 'musetric/Controls';
import { App, Recorder, GameOfLife, Titlebar } from 'musetric/Components';
import { ContentId, contentIdList } from 'musetric/Contents';
import { allThemes, themeIdList } from 'musetric/Themes';
import { localeIdList, createI18n } from 'musetric/Locales';

const init = async () => {
	const params = new URLSearchParams(window.location.search);

	const initThemeId = params.get('theme') || 'dark';

	const initLocaleId = params.get('locale');
	const i18n = await createI18n(initLocaleId);

	const getIndex = (contentId?: ContentId) => {
		if (!contentId) return -1;
		return contentIdList.indexOf(contentId);
	};

	const appProps: App.Props = {
		i18n,
		localeIdList,
		initThemeId,
		themeIdList,
		allThemes,
	};

	const root = (
		<Suspense fallback='loading'>
			<App.View {...appProps}>
				<Titlebar.View />
				<Container.View>
					<Content.View getIndex={getIndex}>
						<Recorder.View />
						<GameOfLife.View size={{ columns: 50, rows: 50 }} />
					</Content.View>
				</Container.View>
			</App.View>
		</Suspense>
	);
	ReactDOM.render(root, document.body);
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
init();
