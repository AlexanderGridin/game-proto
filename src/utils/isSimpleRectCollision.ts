import { PositionData, Size } from "../types";

export const isSimpleRectCollision = (
  a: { pos: PositionData; size: Size },
  b: { pos: PositionData; size: Size },
): boolean => {
  return (
    a.pos.x < b.pos.x + b.size.width &&
    a.pos.x + a.size.width > b.pos.x &&
    a.pos.y < b.pos.y + b.size.height &&
    a.pos.y + a.size.height > b.pos.y
  );
};
