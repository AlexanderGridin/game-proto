import { State } from "../modules";
import { GridRow, Size } from "../types";

type GlobalState = {
  gridRows: GridRow[];
  cellSize: number;
  gameViewportSize: Size;
};

const initialState: GlobalState = {
  gridRows: [],
  cellSize: 64,
  gameViewportSize: {
    width: 960,
    height: 832,
  },
};

export const globalState = new State<GlobalState>(initialState);
