export type CellState = 0 | 1;
export type Row = CellState[];
export type Grid = Row[];

export type Size = {
	rows: number;
	columns: number;
}

export type Options = {
	row: number;
	column: number;
}

export type GenF = (size: Size, grid?: Grid, options?: Options) => Grid;
export type Gen = Record<string, GenF>;

export type Props = {
	size: Size;
};

export type State = {
	grid: Grid;
	generator?: NodeJS.Timeout;
};