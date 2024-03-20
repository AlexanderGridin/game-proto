import { Bush } from "./Bush";
import { GameItem, GameItemType } from "./GameItem";
import { Stone } from "./Stone";

export const isBush = (item: GameItem): item is Bush => {
  return item.type === GameItemType.Bush;
};

export const isStone = (item: GameItem): item is Stone => {
  return item.type === GameItemType.Stone;
};
