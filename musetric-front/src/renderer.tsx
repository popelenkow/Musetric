import './theme/dark.scss'
import './styles.scss'
import React from 'react';
import ReactDOM from 'react-dom';
import { initLocale } from './locale';
import { TitlebarView } from './components/Titlebar';
import { GameOfLifeView } from "./components/GameOfLife";


initLocale();

const props = {
	size: {
		rows: 50,
		columns: 50
	}
}

const root = (
<>
	<TitlebarView />
	<div className='main'>
		<GameOfLifeView {...props}  />
	</div>

</>)
ReactDOM.render(root, document.getElementById("root"));