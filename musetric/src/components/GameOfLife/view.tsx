/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-param-reassign */
import React from 'react';
import produce from 'immer';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Size, Grid, Options, Row, Props, State, GenF, GenO } from './types';

const operations = [
	[0, 1],
	[0, -1],
	[1, 0],
	[-1, 0],
	[1, -1],
	[-1, 1],
	[1, 1],
	[-1, -1],
];

const Gen: GenO = {
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
		return produce(grid, next);
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
		return produce(grid, next);
	},
};

class View extends React.Component<Props & WithTranslation, State> {
	constructor(props: Props & WithTranslation) {
		super(props);
		const { size } = this.props;
		this.state = { grid: Gen.empty(size), generator: undefined };
	}

	setGenerator(isRun: boolean) {
		const { generator } = this.state;
		if (generator) {
			clearInterval(generator);
		}
		const newGenerator: any = isRun
			? setInterval(() => this.setGrid(Gen.next), 100)
			: undefined;
		this.setState({ generator: newGenerator });
	}

	setGrid(gen: GenF, options?: Options) {
		const { size } = this.props;
		const { grid } = this.state;
		const newGrid = gen(size, grid, options);
		this.setState({ grid: newGrid });
	}

	render() {
		const { t, size } = this.props;
		const { grid, generator } = this.state;
		const gridStyle = {
			gridTemplateColumns: `repeat(${size.columns}, 20px)`,
		};

		return (
			<div className='GameOfLife'>
				<div className='GameOfLife__Header'>
					<button type='button' className='Button' onClick={() => this.setGenerator(!generator)}>
						{generator ? t('GameOfLife:stop') : t('GameOfLife:start')}
					</button>
					<button type='button' className='Button' onClick={() => this.setGrid(Gen.random)}>
						{t('GameOfLife:random')}
					</button>
					<button type='button' className='Button' onClick={() => this.setGrid(Gen.empty)}>
						{t('GameOfLife:clear')}
					</button>
				</div>
				<div className='GameOfLife__Grid' style={gridStyle}>
					{grid.map((rows, row) => rows.map((_, column) => {
						const cellClass = grid[row][column] ? 'GameOfLife__CellLive' : 'GameOfLife__CellDead';
						const key = `${row}-${column}`;
						const pick = () => this.setGrid(Gen.pick, { row, column });
						return <div className={cellClass} key={key} onClick={pick} />;
					}))}
				</div>
			</div>
		);
	}
}

const view = withTranslation()(View);
export { view as View };
