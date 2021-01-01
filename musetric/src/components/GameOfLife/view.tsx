/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-param-reassign */
import React, { useState } from 'react';
import produce from 'immer';
import { useTranslation } from 'react-i18next';
import { Size, Grid, Options, Row, GenO, GenF } from './types';

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

export type Props = {
	size: Size;
};

export const View: React.FC<Props> = (props) => {
	const { size } = props;
	const { t } = useTranslation();

	const gridStyle = {
		gridTemplateColumns: `repeat(${size.columns}, 20px)`,
	};

	const [grid, setGrid] = useState<Grid>(Gen.empty(size));
	const [generator, setGenerator] = useState<NodeJS.Timeout>();

	const setGridQ = (gen: GenF, options?: Options) => {
		setGrid(curGrid => gen(size, curGrid, options));
	};

	const setGeneratorQ = (isRun: boolean) => {
		if (generator) {
			clearInterval(generator);
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const newGenerator: any = isRun
			? setInterval(() => setGridQ(Gen.next), 100)
			: undefined;
		setGenerator(newGenerator);
	};

	return (
		<div className='GameOfLife'>
			<div className='GameOfLife__Header'>
				<button type='button' className='Button' onClick={() => setGeneratorQ(!generator)}>
					{generator ? t('GameOfLife:stop') : t('GameOfLife:start')}
				</button>
				<button type='button' className='Button' onClick={() => setGridQ(Gen.random)}>
					{t('GameOfLife:random')}
				</button>
				<button type='button' className='Button' onClick={() => setGridQ(Gen.empty)}>
					{t('GameOfLife:clear')}
				</button>
			</div>
			<div className='GameOfLife__Grid' style={gridStyle}>
				{grid.map((rows, row) => rows.map((_, column) => {
					const cellClass = grid[row][column] ? 'GameOfLife__CellLive' : 'GameOfLife__CellDead';
					const key = `${row}-${column}`;
					const pick = () => setGridQ(Gen.pick, { row, column });
					return <div className={cellClass} key={key} onClick={pick} />;
				}))}
			</div>
		</div>
	);
};
