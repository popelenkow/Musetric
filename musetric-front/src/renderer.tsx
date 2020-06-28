import './styles.scss'
import React from 'react';
import ReactDOM from 'react-dom';
import { initLocale } from './locale';
import { TitlebarView } from './components/Titlebar';
import { GameOfLifeView, GameOfLifeProps } from "./components/GameOfLife";
import { Theme, isTheme, themeSet, localeSet, Locale } from './types';
import i18n from 'i18next';
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
	className: 'title-btn',
	localize: (theme: Theme) => {
		switch (theme) {
			case 'white': return i18n.t('musetric:theme.white')
			case 'dark': return i18n.t('musetric:theme.dark')
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
	className: 'title-btn'
}


const gameOfLifeProps: GameOfLifeProps = {
	size: {
		rows: 50,
		columns: 50
	}
}

const root = (
<>
	<TitlebarView>
		<SwitchView {...themeSwitchProps} />
		<SwitchView {...localeSwitchProps} />
	</TitlebarView>
	<div className='main'>
		<GameOfLifeView {...gameOfLifeProps}  />
	</div>

</>)
ReactDOM.render(root, app);