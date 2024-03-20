import { State } from "../modules";
import { Size } from "../types";

type GlobalState = {
  cellSize: number;
  gameViewportSize: Size;
  chunkSize: Size;
  mapLayers: any[];
};

const cellSize = 32;

const initialState: GlobalState = {
  cellSize,
  gameViewportSize: {
    width: window.innerWidth,
    height: window.innerHeight,
  },
  chunkSize: {
    width: 30 * cellSize,
    height: 30 * cellSize,
  },
  mapLayers: [],
};

export const globalState = new State<GlobalState>(initialState);
