import './index.scss';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import i18n from 'i18next';
import { Locales, Themes, Components, Controls } from 'musetric';
import { Titlebar, ResizeFrame } from './components';
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

const extractTheme: () => Themes.Theme | undefined = () => {
	const themes: Themes.Theme[] = [];
	app.classList.forEach(x => Themes.isTheme(x) && themes.push(x));
	return themes.shift();
};

const params = new URLSearchParams(window.location.search);
const locale = initLocale(params.get('locale'));

const theme = extractTheme() || Themes.themeSet[0];

const themeSwitchProps: Controls.Switch.Props<Themes.Theme> = {
	currentId: theme,
	ids: Themes.themeSet,
	set: (id: Themes.Theme) => {
		app.classList.forEach(x => Themes.isTheme(x) && app.classList.remove(x));
		app.classList.add(id);
		ipc.app.invoke({ type: 'theme', value: id });
	},
	className: 'Titlebar__Button',
	localize: (id, t) => Locales.localizeTheme(id, t) || id,
};

const localeSwitchProps: Controls.Switch.Props<Locales.Locale> = {
	currentId: locale,
	ids: Locales.localeSet,
	set: (id: Locales.Locale) => {
		i18n.changeLanguage(id);
		ipc.app.invoke({ type: 'locale', value: id });
	},
	className: 'Titlebar__Button',
	localize: (id, t) => Locales.localizeLocale(id, t) || id,
};

const root = (
	<Suspense fallback='loading'>
		<Titlebar.View>
			<Controls.Switch.View {...themeSwitchProps} />
			<Controls.Switch.View {...localeSwitchProps} />
		</Titlebar.View>
		<div className='main'>
			<Components.Container.View><Components.Recorder.View /></Components.Container.View>
		</div>
		<ResizeFrame.View />
	</Suspense>
);
ReactDOM.render(root, app);
