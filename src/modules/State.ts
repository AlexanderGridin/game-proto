import { GridRow, Size } from "../types";

const _state: {
  gridRows: GridRow[];
  cellSize: number;
  gameViewportSize: Size;
} = {
  gridRows: [],
  cellSize: 64,
  gameViewportSize: {
    width: 960,
    height: 832,
  },
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

  getGameViewportSize: (): Size => {
    return _state.gameViewportSize;
  },
};
