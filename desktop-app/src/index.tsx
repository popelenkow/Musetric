import './index.scss';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Types, Components, Contexts } from 'musetric';
import { ResizeFrame, WindowsTitlebar } from './components';
import { initLocales } from './locales';
import { ipc } from './ipc';

/*
const isDev = process.env.NODE_ENV === 'development';

isDev && ipc.pytest
	.invoke()
	.then(value => console.log(value))
	.catch(err => console.log(err));
*/

const appElement = document.getElementById('app');
if (!appElement) throw new Error('App not found');

const extractTheme: () => Types.Theme | undefined = () => {
	const themes: Types.Theme[] = [];
	appElement.classList.forEach(x => Types.isTheme(x) && themes.push(x));
	return themes.shift();
};

const params = new URLSearchParams(window.location.search);
const initLocale = initLocales(params.get('locale'));

const getIndex = (contentId?: Types.ContentId) => {
	if (!contentId) return -1;
	return Types.contentSet.indexOf(contentId);
};

const { App } = Contexts;
const { Container, Content, Recorder, Cube, GameOfLife, RecorderOld, Titlebar } = Components;

const appProps: Contexts.App.Props = {
	initAppElement: appElement,
	initContentId: Types.contentSet[0],
	initLocale,
	initTheme: extractTheme() || Types.themeSet[0],
};

const root = (
	<Suspense fallback='loading'>
		<App.Provider {...appProps}>
			<Titlebar.View>
				<WindowsTitlebar.View />
			</Titlebar.View>
			<Container.View>
				<Content.View className='main' getIndex={getIndex}>
					<Recorder.View />
					<Cube.View />
					<GameOfLife.View size={{ columns: 50, rows: 50 }} />
					<RecorderOld.View />
				</Content.View>
			</Container.View>
			<App.Consumer>
				{({ theme, locale }) => {
					theme && ipc.app.invoke({ type: 'theme', value: theme });
					locale && ipc.app.invoke({ type: 'locale', value: locale });
					return <div />;
				}}
			</App.Consumer>
			<ResizeFrame.View />
		</App.Provider>
	</Suspense>
);
ReactDOM.render(root, appElement);
