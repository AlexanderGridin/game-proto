import { Bush, Stone } from "../scenes/TestScene/game-items";
import { GameItem } from "../scenes/TestScene/game-items/GameItem";
import { GridCell } from "../types";

export const getItemForMapCell = (
  code: number,
  cell: GridCell,
): GameItem | null => {
  if (code === 0) return null;

  let item: GameItem | null = null;

  if (code === 325) {
    item = new Stone({
      pos: cell.pos,
      cellIndex: cell.index,
    });
  }

  if (code === 326) {
    item = new Bush({
      pos: cell.pos,
      cellIndex: cell.index,
    });
  }

  return item;
};
