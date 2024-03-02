import { globalState } from "../../../state";
import { Position, Size } from "../../../types";
import { generateId } from "../../../utils";

export enum GameItemType {
  Stone = "stone",
  Bush = "bush",
  Chop = "chop",
  None = "none",
}

export class Collider {
  public pos = new Position();
  public relativePos = new Position();
  public size = new Size();
  public parentId = "";
}

export type GameItemConfig = {
  pos: Position;
  cellIndex: number;
};

export abstract class GameItem {
  public id = generateId();
  public pos = new Position();
  public cellIndex = -1;
  public size: Size = {
    width: globalState.get("cellSize"),
    height: globalState.get("cellSize"),
  };

  public abstract collider: Collider;
  public abstract type: GameItemType;

  constructor(config?: GameItemConfig) {
    if (!config) return;

    const { pos, cellIndex } = config;
    this.pos = pos;
    this.cellIndex = cellIndex;
  }

  protected initColliderPos(): void {
    this.collider.pos = {
      x: this.pos.x + this.collider.relativePos.x,
      y: this.pos.y + this.collider.relativePos.y,
    };
  }
}
