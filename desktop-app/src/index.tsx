import './index.scss';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Locale, Theme } from 'musetric/Contexts';
import { Container, Content } from 'musetric/Controls';
import { App, Recorder, GameOfLife, Titlebar } from 'musetric/Components';
import { ContentId, contentIdList } from 'musetric/Contents';
import { allThemes, themeIdList } from 'musetric/Themes';
import { localeIdList, createI18n } from 'musetric/Locales';
import { ResizeFrame, WindowsTitlebar } from './Components';
import { Ipc } from './Ipc';

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
				<Titlebar.View>
					<WindowsTitlebar.View />
				</Titlebar.View>
				<Container.View>
					<Content.View getIndex={getIndex}>
						<Recorder.View />
						<GameOfLife.View size={{ columns: 50, rows: 50 }} />
					</Content.View>
				</Container.View>
				<Locale.Consumer>
					{({ localeId }) => {
						localeId && Ipc.app.invoke({ type: 'locale', value: localeId });
						return <div />;
					}}
				</Locale.Consumer>
				<Theme.Consumer>
					{({ themeId }) => {
						themeId && Ipc.app.invoke({ type: 'theme', value: themeId });
						return <div />;
					}}
				</Theme.Consumer>
				<ResizeFrame.View />
			</App.View>
		</Suspense>
	);
	ReactDOM.render(root, document.body);
};

/*
const isDev = process.env.NODE_ENV === 'development';

isDev && ipc.pytest
	.invoke()
	.then(value => console.log(value))
	.catch(err => console.log(err));
*/

// eslint-disable-next-line @typescript-eslint/no-floating-promises
init();
