import { Position } from "./Position";
import { Size } from "./Size";

type Obj = {
  type: "bush" | "stone" | "chomp";
  pos: Position;
  size: Size;
};

export type GridCell = {
  pos: Position;
  size: Size;
  index: number;
  indexInRow: number;
  rowIndex: number;
  type?: "grass" | "grass2" | "dirt" | "water";
  objects?: Obj[];
};

export type GridRow = {
  vStart: number;
  vEnd: number;
  cells: GridCell[];
  index: number;
};
