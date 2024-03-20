import { Bush } from "./Bush";
import { Chop } from "./Chop";
import { GameItem, GameItemType } from "./GameItem";

export const isChop = (item: GameItem): item is Chop => {
  return item.type === GameItemType.Chop;
};

export const isBush = (item: GameItem): item is Bush => {
  return item.type === GameItemType.Bush;
};
