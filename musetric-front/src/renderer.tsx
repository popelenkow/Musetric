import React from 'react';
import ReactDOM from 'react-dom';
import GameOfLife from "./components/GameOfLife";

ReactDOM.render(<GameOfLife size={{ rows: 50, columns: 50 }} />, document.getElementById("root"));