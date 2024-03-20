import { Position, Size } from "../types";

export type SpriteSheetFrameData = {
  img: HTMLImageElement;
  pos: Position;
  size: Size;
};

type SpriteSheetConfig = {
  imgSelector: string;
  frameSize: Size;
};

export class SpriteSheet {
  private img: HTMLImageElement;
  private frameSize: Size;

  constructor({ imgSelector, frameSize }: SpriteSheetConfig) {
    const img = document.querySelector<HTMLImageElement>(imgSelector);
    if (!img) {
      throw new Error(
        `Unable to find HTMLImageElement using selector: ${imgSelector}`,
      );
    }

    this.img = img;
    this.frameSize = frameSize;
  }

  public getFrame(row: number, col: number): SpriteSheetFrameData {
    return {
      img: this.img,
      pos: {
        x: (col - 1) * this.frameSize.width,
        y: (row - 1) * this.frameSize.height,
      },
      size: this.frameSize,
    };
  }
}
