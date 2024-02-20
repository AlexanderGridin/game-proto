import { Position } from "./Position";
import { Size } from "./Size";

export type GridCell = {
  pos: Position;
  size: Size;
};

export type GridRow = {
  vStart: number;
  vEnd: number;
  cells: GridCell[];
};
