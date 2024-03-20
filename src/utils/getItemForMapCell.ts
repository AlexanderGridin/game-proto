import { Bush, Stone } from "../scenes/TestScene/game-items";
import { GameItem } from "../scenes/TestScene/game-items/GameItem";
import { GridCell } from "../types";

enum MapItemCode {
  Empty = 0,
  Stone = 325,
  Bush = 326,
}

export const getItemForMapCell = (
  code: number,
  cell: GridCell,
): GameItem | null => {
  if (code === MapItemCode.Empty) return null;

  let item: GameItem | null = null;

  if (code === MapItemCode.Stone) {
    item = new Stone({
      pos: cell.pos,
      cellIndex: cell.index,
    });
  }

  if (code === MapItemCode.Bush) {
    item = new Bush({
      pos: cell.pos,
      cellIndex: cell.index,
    });
  }

  return item;
};
