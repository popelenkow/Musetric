import './theme/dark.scss'
import './renderer.scss'
import React from 'react';
import ReactDOM from 'react-dom';
import { initLocale } from './locale';
import { Titlebar } from './components/Titlebar';
import { GameOfLife } from "./components/GameOfLife";


initLocale();

const props = {
	size: {
		rows: 50,
		columns: 50
	}
}

const root = (
<>
	<Titlebar />
	<div className='main'>
		<GameOfLife {...props}  />
	</div>

</>)
ReactDOM.render(root, document.getElementById("root"));