import { GridRow } from "../types";

const _state: {
  gridRows: GridRow[];
  cellSize: number;
} = {
  gridRows: [],
  cellSize: 64,
};

export const State = {
  setGridRows: (rows: GridRow[]): void => {
    _state.gridRows = rows;
  },
  getGridRows: (): GridRow[] => {
    return _state.gridRows;
  },

  getCellSize: (): number => {
    return _state.cellSize;
  },

  log: (): void => {
    console.log(_state);
  },
};
