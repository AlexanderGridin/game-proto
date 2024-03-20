import { GameObject, SpriteSheetFrameData } from ".";
import { GameItem } from "../scenes/TestScene/game-items";
import { globalState } from "../state";
import { GridCell, Position, PositionData, Size } from "../types";

export type DrawLineConfig = {
  start: Position | PositionData;
  end: Position | PositionData;
  color?: string;
  lineWidth?: number;
};

export type DrawRectConfig = {
  pos: Position | PositionData;
  size: Size;
  color?: string;
};

export type DrawImgconfig = {
  img: HTMLImageElement | HTMLCanvasElement;
  pos: Position | PositionData;
};

export class Renderer {
  public canvas: HTMLCanvasElement;
  private renderingCtx: CanvasRenderingContext2D;

  constructor({ canvasId, size }: { canvasId?: string; size?: Size }) {
    const viewportSize = size || globalState.get("gameViewportSize");

    if (!canvasId) {
      const canvas = document.createElement("canvas");
      canvas.width = viewportSize.width;
      canvas.height = viewportSize.height;

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) {
        throw new Error("Unable to get canvas 2d rendering context");
      }
      this.renderingCtx = ctx;
      this.canvas = canvas;

      return;
    }

    const canvasElement = document.querySelector<HTMLCanvasElement>(canvasId);
    if (!canvasElement) {
      throw new Error("Unable to find canvas element for provided id");
    }

    canvasElement.width = viewportSize.width;
    canvasElement.height = viewportSize.height;

    const ctx = canvasElement.getContext("2d");
    if (!ctx) {
      throw new Error("Unable to get canvas 2d rendering context");
    }

    this.renderingCtx = ctx;
    this.canvas = canvasElement;
  }

  public drawLine({
    start,
    end,
    color = "#000",
    lineWidth = 1,
  }: DrawLineConfig): void {
    this.renderingCtx.lineWidth = lineWidth;
    this.renderingCtx.strokeStyle = color;

    this.renderingCtx.beginPath();

    this.renderingCtx.moveTo(start.x, start.y);
    this.renderingCtx.lineTo(end.x, end.y);

    this.renderingCtx.stroke();
  }

  public fillRect({ pos, size, color = "#000" }: DrawRectConfig) {
    this.renderingCtx.fillStyle = color;
    this.renderingCtx.fillRect(pos.x, pos.y, size.width, size.height);
  }

  public strokeRect({ pos, size, color = "#000" }: DrawRectConfig) {
    this.renderingCtx.strokeStyle = color;
    this.renderingCtx.strokeRect(pos.x, pos.y, size.width, size.height);
  }

  public drawImg({ img, pos }: DrawImgconfig): void {
    this.renderingCtx.drawImage(img, pos.x, pos.y);
  }

  public drawSpriteSheetFrame(
    frame: SpriteSheetFrameData,
    entity: GameObject | GameItem | GridCell,
  ): void {
    this.renderingCtx.drawImage(
      frame.img,
      frame.pos.x,
      frame.pos.y,
      frame.size.width,
      frame.size.height,
      entity.pos.x,
      entity.pos.y,
      entity.size.width,
      entity.size.height,
    );
  }

  public clear(): void {
    this.renderingCtx.clearRect(0, 0, this.width, this.height);
  }

  public get width(): number {
    return this.renderingCtx.canvas.width;
  }

  public get height(): number {
    return this.renderingCtx.canvas.height;
  }

  public get TMPctx(): CanvasRenderingContext2D {
    return this.renderingCtx;
  }

  public set width(w: number) {
    this.canvas.width = w;
  }

  public set height(h: number) {
    this.canvas.height = h;
  }
}
