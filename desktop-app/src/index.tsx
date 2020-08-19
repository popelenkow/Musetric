import './index.scss'
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import i18n from 'i18next';
import { Locales, Themes, Components, Controls } from 'musetric';
import { Titlebar, ResizeFrame } from './components';
import { ipc } from './ipc';
import fs from 'fs'

const isDev = process.env.NODE_ENV === 'development'

isDev && ipc.pytest
	.invoke()
	.then(value => console.log(value))
	.catch(err => console.log(err))

const app = document.getElementById("app");
if (!app) throw new Error('App not found');

const resources: any = {};
Locales.localeSet.forEach(locale => {
	resources[locale] = {};
	Locales.namespaceSet.forEach(ns => {
		const bundle = JSON.parse(fs.readFileSync(`./locale/${locale}/${ns}.json`, 'utf8'))
		resources[locale][ns] = bundle;
	})
})

const params = new URLSearchParams(window.location.search)
const locale = Locales.initLocale(i18n, params.get('locale'), resources)

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
	ids: Locales.localeSet,
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