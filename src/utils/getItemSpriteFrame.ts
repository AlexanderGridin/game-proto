import { SpriteSheet, SpriteSheetFrameData } from "../modules";
import { GameItem, GameItemType, isBush } from "../scenes/TestScene/game-items";

export const getItemSpriteFrame = (
  item: GameItem,
  spriteSheet: SpriteSheet,
): SpriteSheetFrameData | null => {
  const { Bush, Stone } = GameItemType;
  let frame: SpriteSheetFrameData | null = null;

  switch (item.type) {
    case Bush:
      frame = spriteSheet.getFrame(3, 1);
      break;

    case Stone:
      frame = spriteSheet.getFrame(3, 2);
      break;
  }

  if (isBush(item) && item.withBerries) {
    frame = spriteSheet.getFrame(2, 1);
  }

  return frame;
};
