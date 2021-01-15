import './index.scss';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Types, Components, Contexts } from 'musetric';
import { initLocales } from './Locales';

const appElement = document.getElementById('app');
if (!appElement) throw new Error('App not found');

const params = new URLSearchParams(window.location.search);
const initLocale = initLocales(params.get('locale'));
appElement.classList.add('dark');

const extractTheme: () => Types.Theme | undefined = () => {
	const themes: Types.Theme[] = [];
	appElement.classList.forEach(x => Types.isTheme(x) && themes.push(x));
	return themes.shift();
};

const getIndex = (contentId?: Types.ContentId) => {
	if (!contentId) return -1;
	return Types.contentSet.indexOf(contentId);
};

const { App } = Contexts;
const { Container, Content, Recorder, GameOfLife, Titlebar } = Components;

const appProps: Contexts.App.Props = {
	initAppElement: appElement,
	initContentId: Types.contentSet[0],
	initLocale,
	initTheme: extractTheme() || Types.themeSet[0],
};

const root = (
	<Suspense fallback='loading'>
		<App.Provider {...appProps}>
			<Titlebar.View />
			<Container.View>
				<Content.View className='main' getIndex={getIndex}>
					<Recorder.View />
					<GameOfLife.View size={{ columns: 50, rows: 50 }} />
				</Content.View>
			</Container.View>
		</App.Provider>
	</Suspense>
);
ReactDOM.render(root, appElement);
