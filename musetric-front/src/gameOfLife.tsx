import React from 'react'
import produce from 'immer';
import { ipcRenderer } from 'electron';
type Size = {
  rows: number;
  columns: number;
}
type Options = {
  row: number;
  column: number;
}
type Row = number[];
type Grid = Row[];
type GameOfLifeProps = {
  size: Size;
};
type GameOfLifeState = {
  grid: Grid;
  generator?: NodeJS.Timeout;
};

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

type GenF = (size: Size, grid?: Grid, options?: Options) => Grid
const Gen: Record<string, GenF> = {
  empty: (size: Size) => {
    const grid: Grid = [];
    for (let i = 0; i < size.rows; i++) {
      const row = [];
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
      const row = [];
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

export default class GameOfLife extends React.Component<GameOfLifeProps, GameOfLifeState> {
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
    const generator: any = isRun // ToDo: Bug hot load
      ? setInterval(() => this.setGrid(Gen.next), 4000)
      : undefined;
    this.setState({ ...this.state, generator });
  }

  setGrid(gen: GenF, options?: Options) {
    const grid = gen(this.props.size, this.state.grid, options)
    this.setState({ ...this.state, grid })
  }
 
	render() {
    const gridStyle = {
      display: "grid",
      gridTemplateColumns: `repeat(${this.props.size.columns}, 20px)`
    }
    const pointStyle = (life: boolean) => ({
      width: 20,
      height: 20,
      backgroundColor: life ? "black" : "white",
      border: "solid 1px gray"
    })
    const grid = this.state.grid;
		return ( 
    <>
      <button onClick={() => this.setGenerator(!this.state.generator)}>
        {this.state.generator ? "stop" : "start"}
      </button>
      <button onClick={() => this.setGrid(Gen.random)}>
        random
      </button>
      <button onClick={() => this.setGrid(Gen.empty)}>
        clear
      </button>
      <div style={gridStyle}>
        {grid.map((rows, row) =>
          rows.map((_, column) =>
            <div key={`${row}-${column}`} onClick={() => this.setGrid(Gen.pick, { row, column })} style={pointStyle(!!grid[row][column])}/>
          )
        )}
      </div>
    </>
    )
	}
}