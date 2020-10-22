/* eslint-disable no-shadow */
/* eslint-disable max-len */
import './index.scss';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Types, Components, Contexts } from 'musetric';
import { ResizeFrame, WindowsTitlebar } from './components';
import { initLocale } from './locales';
import { ipc } from './ipc';

/*
const isDev = process.env.NODE_ENV === 'development';

isDev && ipc.pytest
	.invoke()
	.then(value => console.log(value))
	.catch(err => console.log(err));
*/

const app = document.getElementById('app');
if (!app) throw new Error('App not found');

const extractTheme: () => Types.Theme | undefined = () => {
	const themes: Types.Theme[] = [];
	app.classList.forEach(x => Types.isTheme(x) && themes.push(x));
	return themes.shift();
};

const params = new URLSearchParams(window.location.search);
const locale = initLocale(params.get('locale'));

const getIndex = (contentId?: Types.ContentId) => {
	if (!contentId) return -1;
	return Types.contentSet.indexOf(contentId);
};

const { AppContext } = Contexts;
const { Container, Content, Recorder, Cube, GameOfLife, RecorderOld, Titlebar } = Components;
const root = (
	<Suspense fallback='loading'>
		<AppContext.Provider initContentId={Types.contentSet[0]} initLocale={locale} initTheme={extractTheme() || Types.themeSet[0]}>
			<Titlebar.View app={app}>
				<WindowsTitlebar.View />
			</Titlebar.View>
			<Content.View className='main' getIndex={getIndex}>
				<Container.View><Recorder.View /></Container.View>
				<Container.View><Cube.View app={app} /></Container.View>
				<Container.View><GameOfLife.View size={{ columns: 50, rows: 50 }} /></Container.View>
				<Container.View><RecorderOld.View /></Container.View>
			</Content.View>
			<AppContext.Consumer>
				{({ theme, locale }) => {
					theme && ipc.app.invoke({ type: 'theme', value: theme });
					locale && ipc.app.invoke({ type: 'locale', value: locale });
					return <div />;
				}}
			</AppContext.Consumer>
			<ResizeFrame.View />
		</AppContext.Provider>
	</Suspense>
);
ReactDOM.render(root, app);
