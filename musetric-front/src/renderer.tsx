import './theme/dark.scss'
import React from 'react';
import ReactDOM from 'react-dom';
import { GameOfLife } from "./GameOfLife";
import { initLocale } from './locale';


initLocale();

const props = {
	size: {
		rows: 50,
		columns: 50
	}
}

ReactDOM.render(<GameOfLife {...props}  />, document.getElementById("root"));