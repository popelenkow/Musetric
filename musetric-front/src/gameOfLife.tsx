import * as React from "react"
import produce from "immer";

const numRows = 50;
const numCols = 50;

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0]
];

const emptyGen = () => {
  const grid: Grid = [];
  for (let i = 0; i < numRows; i++) {
    const row = Array.from(Array(numCols), () => 0);
    grid.push(row);
  }
  return grid;
}

const randomGen = () => {
  const grid: Grid = [];
  for (let i = 0; i < numRows; i++) {
    const row = Array.from(Array(numCols), () => Math.random() > 0.7 ? 1 : 0);
    grid.push(row);
  }
  return grid;
}

const pickGen = (oldGrid: Grid, row: number, column: number) => {
  const next = (newGrid) => {
    newGrid[row][column] = oldGrid[row][column] ? 0 : 1;
  };
  return produce(oldGrid, next)
}

const nextGen = (oldGrid: Grid) => {
  const next = (newGrid) => {
    for (let i = 0; i < numRows; i++) {
      for (let k = 0; k < numCols; k++) {
        let neighbors = 0;
        operations.forEach(([x, y]) => {
          const newI = i + x;
          const newK = k + y;
          if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
            neighbors += oldGrid[newI][newK];
          }
        });

        if (neighbors < 2 || neighbors > 3) {
          newGrid[i][k] = 0;
        } else if (oldGrid[i][k] === 0 && neighbors === 3) {
          newGrid[i][k] = 1;
        }
      }
    }
  };
  return produce(oldGrid, next)
}

type Row = number[];
type Grid = Row[];
type GameOfLifeProps = {};
type GameOfLifeState = {
  grid: Grid;
  process?: NodeJS.Timeout;
};

export default class GameOfLife extends React.Component<GameOfLifeProps, GameOfLifeState> {
	constructor(props: GameOfLifeProps) {
    super(props);
    this.state = { grid: emptyGen(), process: undefined };
    //this.setState({ collapsed: true, hidden: this.state.hidden, report: this.state.report })
  }

  setProcess(isRun: boolean) {
    if (this.state.process) {
      clearInterval(this.state.process);
    }
    const process = isRun
      ? setInterval(() => this.setGrid(nextGen), 100)
      : undefined;
    this.setState({ ...this.state, process })
  }

  setGrid(mutate: (old: Grid) => Grid) {
    const grid = mutate(this.state.grid)
    this.setState({ ...this.state, grid })
  }
 
	render() {
    const gridStyle = {
      display: "grid",
      gridTemplateColumns: `repeat(${numCols}, 20px)`
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
      <button onClick={() => this.setProcess(!this.state.process)}>
        {this.state.process ? "stop" : "start"}
      </button>
      <button onClick={() => this.setGrid(randomGen)}>
        random
      </button>
      <button onClick={() => this.setGrid(emptyGen)}>
        clear
      </button>
      <div style={gridStyle}>
        {grid.map((rows, i) =>
          rows.map((col, k) =>
            <div key={`${i}-${k}`} onClick={() => this.setGrid((g) => pickGen(g, i, k))} style={pointStyle(!!grid[i][k])}/>
          )
        )}
      </div>
    </>
    )
	}
}