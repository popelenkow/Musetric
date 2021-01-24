/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-param-reassign */
import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';
import produce from 'immer';
import { useTranslation } from 'react-i18next';
import { Controls } from '..';
import { theming, Theme } from '../Contexts/Theme';

const getStyles = (theme: Theme) => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		overflow: 'hidden',
		width: '100%',
		height: '100%',
		...Controls.Scrollbar.getStyles(theme).root,
	},
	header: {
		display: 'flex',
		flexDirection: 'row',
		height: '28px',
		backgroundColor: theme.sidebarBg,
		borderBottom: `1px solid ${theme.splitter}`,
	},
	grid: {
		display: 'grid',
		overflow: 'auto',
		width: '100%',
		height: '100%',
	},
	cellLive: {
		width: '20px',
		height: '20px',
		border: `solid 1px ${theme.splitter}`,
		backgroundColor: theme.cellLive,
	},
	cellDead: {
		width: '20px',
		height: '20px',
		border: `solid 1px ${theme.splitter}`,
		backgroundColor: theme.cellDead,
	},
});

const useStyles = createUseStyles(getStyles, { name: 'GameOfLife', theming });

export type CellState = 0 | 1;
export type Row = CellState[];
export type Grid = Row[];

export type Size = {
	rows: number;
	columns: number;
};

export type Options = {
	row: number;
	column: number;
};

export type GenF = (size: Size, grid?: Grid, options?: Options) => Grid;
export type GenO = Record<string, GenF>;

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
	const classes = useStyles();
	const buttonClasses = Controls.Button.useStyles();
	const { t } = useTranslation();

	const gridStyle = {
		gridTemplateColumns: `repeat(${size.columns}, 20px)`,
	};

	const [grid, setGrid] = useState<Grid>(Gen.empty(size));
	const [generator, setGenerator] = useState<number>();

	const setGridQ = (gen: GenF, options?: Options) => {
		setGrid(curGrid => gen(size, curGrid, options));
	};

	const setGeneratorQ = (isRun: boolean) => {
		if (generator) {
			clearInterval(generator);
		}

		const newGenerator = isRun
			? setInterval(() => setGridQ(Gen.next), 100)
			: undefined;
		setGenerator(newGenerator);
	};

	return (
		<div className={classes.root}>
			<div className={classes.header}>
				<button type='button' className={buttonClasses.root} onClick={() => setGeneratorQ(!generator)}>
					{generator ? t('GameOfLife:stop') : t('GameOfLife:start')}
				</button>
				<button type='button' className={buttonClasses.root} onClick={() => setGridQ(Gen.random)}>
					{t('GameOfLife:random')}
				</button>
				<button type='button' className={buttonClasses.root} onClick={() => setGridQ(Gen.empty)}>
					{t('GameOfLife:clear')}
				</button>
			</div>
			<div className={classes.grid} style={gridStyle}>
				{grid.map((rows, row) => rows.map((_, column) => {
					const cellClass = grid[row][column] ? classes.cellLive : classes.cellDead;
					const key = `${row}-${column}`;
					const pick = () => setGridQ(Gen.pick, { row, column });
					return <div className={cellClass} key={key} onClick={pick} />;
				}))}
			</div>
		</div>
	);
};
