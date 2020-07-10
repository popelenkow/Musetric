import './styles.scss'
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import i18n, { TFunction } from 'i18next';
import { initLocale, originalLocaleSet } from './locale';
import { Theme, isTheme, themeSet, localeSet, Locale } from './types';
import { ResizeFrameView } from './components/ResizeFrame';
import { TitlebarView } from './components/Titlebar';
import { GameOfLifeView, GameOfLifeProps } from "./components/GameOfLife";
import { Switch, SwitchProps } from './controls';
import { ContainerView } from './components/Container';

const app = document.getElementById("app");
if (!app) throw new Error('App not found');

initLocale();

const extractTheme: () => Theme | undefined = () => {
	const themes: Theme[] = [];
	app.classList.forEach(x => isTheme(x) && themes.push(x))
	return themes.shift();
}

const themeSwitchProps: SwitchProps<Theme> = {
	currentId: extractTheme() || themeSet[0],
	ids: themeSet,
	set: (theme: Theme) => {
		app.classList.forEach(x => isTheme(x) && app.classList.remove(x))
		app.classList.add(theme)
	},
	className: 'titlebar-btn',
	localize: (theme: Theme, t: TFunction) => {
		if (theme == 'white') return t('musetric:theme.white')
		else if (theme == 'dark') return t('musetric:theme.dark')
		else return theme;
	}
}

const localeSwitchProps: SwitchProps<Locale> = {
	currentId: localeSet[0],
	ids: localeSet,
	set: (locale: Locale) => {
		i18n.changeLanguage(locale);
	},
	className: 'titlebar-btn',
	localize: (locale: Locale) => originalLocaleSet[locale] || locale
}


const gameOfLifeProps: GameOfLifeProps = {
	size: {
		rows: 50,
		columns: 50
	}
}

const root = (
<Suspense fallback='loading'>
	<TitlebarView>
		<Switch {...themeSwitchProps} />
		<Switch {...localeSwitchProps} />
	</TitlebarView>
	<div className='main'>
		<ContainerView><GameOfLifeView {...gameOfLifeProps}  /></ContainerView>
		<ContainerView><GameOfLifeView {...gameOfLifeProps}  /></ContainerView>
	</div>
	<ResizeFrameView />
</Suspense>)
ReactDOM.render(root, app);