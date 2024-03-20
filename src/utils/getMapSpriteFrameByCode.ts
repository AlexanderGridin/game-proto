import { SpriteSheet, SpriteSheetFrameData } from "../modules";

export const getMapSpriteFrameByCode = (
  code: number,
  spriteSheet: SpriteSheet,
): SpriteSheetFrameData | null => {
  let frame: SpriteSheetFrameData | null = null;

  if (code === 305) {
    frame = spriteSheet.getFrame(1, 1);
  }

  if (code === 306) {
    frame = spriteSheet.getFrame(1, 2);
  }

  if (code === 307) {
    frame = spriteSheet.getFrame(1, 3);
  }

  if (code === 308) {
    frame = spriteSheet.getFrame(1, 4);
  }

  if (code === 309) {
    frame = spriteSheet.getFrame(1, 5);
  }

  if (code === 310) {
    frame = spriteSheet.getFrame(1, 6);
  }

  if (code === 311) {
    frame = spriteSheet.getFrame(1, 7);
  }

  if (code === 312) {
    frame = spriteSheet.getFrame(1, 8);
  }

  if (code === 313) {
    frame = spriteSheet.getFrame(1, 9);
  }

  return frame;
};
