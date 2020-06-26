import './styles.scss'
import React from 'react';
import ReactDOM from 'react-dom';
import { initLocale } from './locale';
import { TitlebarView, TitlebarProps } from './components/Titlebar';
import { GameOfLifeView, GameOfLifeProps } from "./components/GameOfLife";
import { Theme, isTheme } from './types';

const app = document.getElementById("app");
if (!app) throw new Error('App not found');

initLocale();

const parseTheme: () => Theme | undefined = () => {
	const themes: Theme[] = [];
	app.classList.forEach(x => isTheme(x) && themes.push(x))
	return themes.shift();
}

const setTheme = (theme: Theme) => {
	app.classList.forEach(x => isTheme(x) && app.classList.remove(x))
	app.classList.add(theme)
}
const theme = parseTheme() || 'white'

const titlebarProps: TitlebarProps = { theme, setTheme }

const gameOfLifeProps: GameOfLifeProps = {
	size: {
		rows: 50,
		columns: 50
	}
}

const root = (
<>
	<TitlebarView {...titlebarProps} />
	<div className='main'>
		<GameOfLifeView {...gameOfLifeProps}  />
	</div>

</>)
ReactDOM.render(root, app);