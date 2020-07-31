import './styles.scss'
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import i18n, { TFunction } from 'i18next';
import { initLocale, naturalLocale, localeSet, Locale } from './locale';
import { Theme, isTheme, themeSet } from './theme';
import { Container, Titlebar, ResizeFrame, Recorder } from './components';
import { Switch } from './controls';
import { ipc } from './ipc';

const isDev = process.env.NODE_ENV === 'development'

isDev && ipc.pytest
	.invoke()
	.then(value => console.log(value))
	.catch(err => console.log(err))

const app = document.getElementById("app");
if (!app) throw new Error('App not found');

const params = new URLSearchParams(window.location.search)
const locale = initLocale(params.get('locale'));


const extractTheme: () => Theme | undefined = () => {
	const themes: Theme[] = [];
	app.classList.forEach(x => isTheme(x) && themes.push(x))
	return themes.shift();
}

const themeSwitchProps: Switch.Props<Theme> = {
	currentId: extractTheme() || themeSet[0],
	ids: themeSet,
	set: (theme: Theme) => {
		app.classList.forEach(x => isTheme(x) && app.classList.remove(x))
		app.classList.add(theme)
		ipc.app.invoke({ type: 'theme', theme })
	},
	className: 'Titlebar__Button',
	localize: (theme: Theme, t: TFunction) => {
		if (theme == 'white') return t('Musetric:theme.white')
		else if (theme == 'dark') return t('Musetric:theme.dark')
		else return theme;
	}
}

const localeSwitchProps: Switch.Props<Locale> = {
	currentId: locale,
	ids: localeSet,
	set: (locale: Locale) => {
		i18n.changeLanguage(locale);
		ipc.app.invoke({ type: 'locale', locale })
	},
	className: 'Titlebar__Button',
	localize: (locale: Locale) => naturalLocale(locale) || locale
}

const root = (
<Suspense fallback='loading'>
	<Titlebar.View>
		<Switch.View {...themeSwitchProps} />
		<Switch.View {...localeSwitchProps} />
	</Titlebar.View>
	<div className='main'>
		<Container.View><Recorder.View /></Container.View>
	</div>
	<ResizeFrame.View />
</Suspense>)
ReactDOM.render(root, app);