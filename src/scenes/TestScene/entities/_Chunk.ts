import { Position, Size } from "../../../types";
// import { Grid } from "./Grid";

export class Chunk {
  public pos: Position;
  public size: Size;
  // public grid: Grid;

  constructor(pos: Position, size: Size) {
    this.pos = pos;
    this.size = size;
  }
}
