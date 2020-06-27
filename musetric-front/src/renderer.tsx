import './styles.scss'
import React from 'react';
import ReactDOM from 'react-dom';
import { initLocale } from './locale';
import { TitlebarView, TitlebarProps } from './components/Titlebar';
import { GameOfLifeView, GameOfLifeProps } from "./components/GameOfLife";
import { Theme, isTheme } from './types';
import i18next from 'i18next';
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
	currentId: extractTheme() || 'white',
	ids: ['white', 'dark'],
	set: (theme: Theme) => {
		app.classList.forEach(x => isTheme(x) && app.classList.remove(x))
		app.classList.add(theme)
	},
	className: 'title-btn',
	localize: (theme: Theme) => {
		switch (theme) {
			case 'white': return i18next.t('musetric:theme.white')
			case 'dark': return i18next.t('musetric:theme.dark')
			default: return theme;
		}
	}
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
	</TitlebarView>
	<div className='main'>
		<GameOfLifeView {...gameOfLifeProps}  />
	</div>

</>)
ReactDOM.render(root, app);