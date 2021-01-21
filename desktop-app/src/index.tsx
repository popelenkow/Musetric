import './index.scss';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Types, Components, Contexts, Controls } from 'musetric';
import { ResizeFrame, WindowsTitlebar } from './Components';
import { initLocales } from './Locales';
import { Ipc } from './Ipc';

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
const { Recorder, GameOfLife, Titlebar } = Components;
const { Container, Content } = Controls;

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
					<GameOfLife.View size={{ columns: 50, rows: 50 }} />
				</Content.View>
			</Container.View>
			<App.Consumer>
				{({ theme, locale }) => {
					theme && Ipc.app.invoke({ type: 'theme', value: theme });
					locale && Ipc.app.invoke({ type: 'locale', value: locale });
					return <div />;
				}}
			</App.Consumer>
			<ResizeFrame.View />
		</App.Provider>
	</Suspense>
);
ReactDOM.render(root, appElement);
