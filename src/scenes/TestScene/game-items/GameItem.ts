import { Collider } from "../../../modules";
import { globalState } from "../../../state";
import { Position, Size } from "../../../types";
import { generateId } from "../../../utils";

export enum GameItemType {
  Stone = "stone",
  Bush = "bush",
  Chop = "chop",
  None = "none",
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

  public abstract collider: Collider<GameItem>;
  public abstract type: GameItemType;

  constructor(config?: GameItemConfig) {
    if (!config) return;

    const { pos, cellIndex } = config;
    this.pos = pos;
    this.cellIndex = cellIndex;
  }
}
