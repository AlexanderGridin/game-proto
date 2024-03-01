import { State } from "../modules";
import { Size } from "../types";

type GlobalState = {
  cellSize: number;
  gameViewportSize: Size;
  chunkSize: Size;
  mapLayers: any;
};

const cellSize = 32;

const initialState: GlobalState = {
  cellSize,
  gameViewportSize: {
    // width: 960,
    // height: 816,
    width: window.innerWidth,
    height: window.innerHeight,
  },
  chunkSize: {
    width: 30 * cellSize,
    height: 30 * cellSize,
    // width: 15 * cellSize,
    // height: 15 * cellSize,
  },
  mapLayers: [],
};

export const globalState = new State<GlobalState>(initialState);
