import './styles.scss'
import React from 'react'
import produce from 'immer';
import { ipcRenderer } from 'electron';
import { Size, Grid, Options, Row, GameOfLifeProps, GameOfLifeState, GenF, Gen } from './types';
import i18n from 'i18next'

const operations = [
	[0, 1],
	[0, -1],
	[1, 0],
	[-1, 0],
	[1, -1],
	[-1, 1],
	[1, 1],
	[-1, -1]
];


const Gen: Gen = {
	empty: (size: Size) => {
		const grid: Grid = [];
		for (let i = 0; i < size.rows; i++) {
			const row: Row = [];
			for (let j = 0; j < size.columns; j++) {
				row.push(0);
			}
			grid.push(row);
			}
		return grid;
	},
	random: (size: Size) => {
		const grid: Grid = [];
		for (let i = 0; i < size.rows; i++) {
			const row: Row = [];
			for (let j = 0; j < size.columns; j++) {
				row.push(Math.random() > 0.7 ? 1 : 0);
			}
			grid.push(row);
		}
		return grid;
	},
	pick: (size: Size, grid?: Grid, options?: Options) => {
		if (!grid) return Gen.empty(size);
		if (!options) return grid;
		const { row, column } = options;
		const next = (nextGrid: Grid) => {
			nextGrid[row][column] = grid[row][column] ? 0 : 1;
		};
		return produce(grid, next)
	},
	next: (size: Size, grid?: Grid) => {
		if (!grid) return Gen.empty(size);
		const next = (nextGrid: Grid) => {
		for (let i = 0; i < size.rows; i++) {
			for (let j = 0; j < size.columns; j++) {
				let neighbors = 0;
				operations.forEach(([x, y]) => {
					const newI = x + i;
					const newK = y + j;
					if (newI >= 0 && newI < size.rows && newK >= 0 && newK < size.columns) {
						neighbors += grid[newI][newK];
					}
				});
		
				if (neighbors < 2 || neighbors > 3) {
						nextGrid[i][j] = 0;
				} else if (grid[i][j] === 0 && neighbors === 3) {
						nextGrid[i][j] = 1;
				}
			}
		}
		};
		return produce(grid, next)
	}
}

export class GameOfLifeView extends React.Component<GameOfLifeProps, GameOfLifeState> {
	constructor(props: GameOfLifeProps) {
		super(props);
		this.state = { grid: Gen.empty(this.props.size), generator: undefined };
	}

	componentDidMount() {
		ipcRenderer.on('main-complete', (event, args) => {
			console.log(args);
		});

		ipcRenderer.send('main-request', {});
	}

	setGenerator(isRun: boolean) {
		if (this.state.generator) {
			clearInterval(this.state.generator);
		}
		const generator: any = isRun // ToDo: Bug hot load withot any
			? setInterval(() => this.setGrid(Gen.next), 100)
			: undefined;
		this.setState({ ...this.state, generator });
	}

	setGrid(gen: GenF, options?: Options) {
		const grid = gen(this.props.size, this.state.grid, options)
		this.setState({ ...this.state, grid })
	}
	
	render() {
		const gridStyle = {
			gridTemplateColumns: `repeat(${this.props.size.columns}, 20px)`
		}
		const grid = this.state.grid;
		return ( 
		<div className='game'>
			<button onClick={() => this.setGenerator(!this.state.generator)}>
				{this.state.generator ? i18n.t('game:stop') : i18n.t('game:start')}
			</button>
			<button onClick={() => this.setGrid(Gen.random)}>
				{i18n.t('game:random')}
			</button>
			<button onClick={() => this.setGrid(Gen.empty)}>
				{i18n.t('game:clear')}
			</button>
			<div className='game-grid' style={gridStyle}>
				{grid.map((rows, row) =>
					rows.map((_, column) => {
						const cellClass = grid[row][column] ? 'game-cell-live' : 'game-cell-dead';
						const key = `${row}-${column}`;
						const pick = () => this.setGrid(Gen.pick, { row, column });
						return <div className={cellClass} key={key} onClick={pick}/>
					})
				)}
			</div>
		</div>)
	}
}