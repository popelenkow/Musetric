import './index.scss'
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import i18n from 'i18next';
import { initLocale, localeSet } from './locale';
import { Theme, isTheme, themeSet } from './theme';
import { Locales, Components, Controls } from 'musetric'
import { Titlebar } from './components';

const app = document.getElementById("app");
if (!app) throw new Error('App not found');

const params = new URLSearchParams(window.location.search)
const locale = initLocale(params.get('locale'));


const extractTheme: () => Theme | undefined = () => {
	const themes: Theme[] = [];
	app.classList.forEach(x => isTheme(x) && themes.push(x))
	return themes.shift();
}

const themeSwitchProps: Controls.Switch.Props<Theme> = {
	currentId: extractTheme() || themeSet[0],
	ids: themeSet,
	set: (theme: Theme) => {
		app.classList.forEach(x => isTheme(x) && app.classList.remove(x))
		app.classList.add(theme)
	},
	className: 'Titlebar__Button',
	localize: (theme, t) => Locales.localizeTheme(theme, t) || theme 
}

const localeSwitchProps: Controls.Switch.Props<Locales.Locale> = {
	currentId: locale,
	ids: localeSet,
	set: (locale: Locales.Locale) => {
		i18n.changeLanguage(locale);
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
</Suspense>)
ReactDOM.render(root, app);