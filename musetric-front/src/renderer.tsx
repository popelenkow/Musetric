import './styles.scss'
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { initLocale, originalLocaleSet } from './locale';
import { TitlebarView } from './components/Titlebar';
import { GameOfLifeView, GameOfLifeProps } from "./components/GameOfLife";
import { Theme, isTheme, themeSet, localeSet, Locale } from './types';
import i18n, { TFunction } from 'i18next';
import { SwitchView, SwitchProps } from './components/Switch';

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
		switch (theme) {
			case 'white': return t('musetric:theme.white')
			case 'dark': return t('musetric:theme.dark')
			default: return theme;
		}
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
		<SwitchView {...themeSwitchProps} />
		<SwitchView {...localeSwitchProps} />
	</TitlebarView>
	<div className='main'>
		<GameOfLifeView {...gameOfLifeProps}  />
	</div>
</Suspense>)
ReactDOM.render(root, app);