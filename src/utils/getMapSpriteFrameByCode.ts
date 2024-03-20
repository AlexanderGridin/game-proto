import { SpriteSheet, SpriteSheetFrameData } from "../modules";

enum MapSpriteCode {
  PlainGrass = 305,
  WaterGrassTopLeft = 306,
  WaterGrassTop = 307,
  WaterGrassTopRight = 308,
  WaterGrassLeft = 309,
  WaterGrassRight = 310,
  WaterGrassBottomLeft = 311,
  WaterGrassBottom = 312,
  WaterGrassBottomRight = 313,
}

export const getMapSpriteFrameByCode = (
  code: number,
  spriteSheet: SpriteSheet,
): SpriteSheetFrameData | null => {
  let frame: SpriteSheetFrameData | null = null;

  if (code === MapSpriteCode.PlainGrass) {
    frame = spriteSheet.getFrame(1, 1);
  }

  if (code === MapSpriteCode.WaterGrassTopLeft) {
    frame = spriteSheet.getFrame(1, 2);
  }

  if (code === MapSpriteCode.WaterGrassTop) {
    frame = spriteSheet.getFrame(1, 3);
  }

  if (code === MapSpriteCode.WaterGrassTopRight) {
    frame = spriteSheet.getFrame(1, 4);
  }

  if (code === MapSpriteCode.WaterGrassLeft) {
    frame = spriteSheet.getFrame(1, 5);
  }

  if (code === MapSpriteCode.WaterGrassRight) {
    frame = spriteSheet.getFrame(1, 6);
  }

  if (code === MapSpriteCode.WaterGrassBottomLeft) {
    frame = spriteSheet.getFrame(1, 7);
  }

  if (code === MapSpriteCode.WaterGrassBottom) {
    frame = spriteSheet.getFrame(1, 8);
  }

  if (code === MapSpriteCode.WaterGrassBottomRight) {
    frame = spriteSheet.getFrame(1, 9);
  }

  return frame;
};
