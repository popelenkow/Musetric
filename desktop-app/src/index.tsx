import './index.scss'
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import i18n from 'i18next';
import { Locales, Themes, Components, Controls } from 'musetric';
import { Titlebar, ResizeFrame } from './components';
import { initLocale } from './locales';
import { ipc } from './ipc';
import { localeSet} from './locales';

const isDev = process.env.NODE_ENV === 'development'

isDev && ipc.pytest
	.invoke()
	.then(value => console.log(value))
	.catch(err => console.log(err))

const app = document.getElementById("app");
if (!app) throw new Error('App not found');

const params = new URLSearchParams(window.location.search)
const locale = initLocale(params.get('locale'))

const extractTheme: () => Themes.Theme | undefined = () => {
	const themes: Themes.Theme[] = [];
	app.classList.forEach(x => Themes.isTheme(x) && themes.push(x))
	return themes.shift();
}

const themeSwitchProps: Controls.Switch.Props<Themes.Theme> = {
	currentId: extractTheme() || Themes.themeSet[0],
	ids: Themes.themeSet,
	set: (theme: Themes.Theme) => {
		app.classList.forEach(x => Themes.isTheme(x) && app.classList.remove(x))
		app.classList.add(theme)
		ipc.app.invoke({ type: 'theme', theme })
	},
	className: 'Titlebar__Button',
	localize: (theme, t) => Locales.localizeTheme(theme, t) || theme 
}

const localeSwitchProps: Controls.Switch.Props<Locales.Locale> = {
	currentId: locale,
	ids: localeSet,
	set: (locale: Locales.Locale) => {
		i18n.changeLanguage(locale);
		ipc.app.invoke({ type: 'locale', locale })
	},
	className: 'Titlebar__Button',
	localize: (locale, t) => Locales.localizeLng(locale, t) || locale
}

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
</Suspense>)
ReactDOM.render(root, app);