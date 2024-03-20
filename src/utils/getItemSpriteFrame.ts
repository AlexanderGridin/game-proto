import { SpriteSheet, SpriteSheetFrameData } from "../modules";
import { GameItem, isBush, isStone } from "../scenes/TestScene/game-items";

export const getItemSpriteFrame = (
  item: GameItem,
  spriteSheet: SpriteSheet,
): SpriteSheetFrameData | null => {
  let frame: SpriteSheetFrameData | null = null;

  if (isBush(item)) {
    frame = item.withBerries
      ? spriteSheet.getFrame(2, 1)
      : spriteSheet.getFrame(3, 1);
  }

  if (isStone(item)) {
    frame = spriteSheet.getFrame(3, 2);
  }

  return frame;
};
