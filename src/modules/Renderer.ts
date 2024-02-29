import { globalState } from "../state";
import { Position, Size } from "../types";

export type DrawLineConfig = {
  start: Position;
  end: Position;
  color?: string;
  lineWidth?: number;
};

export type DrawRectConfig = {
  pos: Position;
  size: Size;
  color?: string;
};

export type DrawImgconfig = {
  img: HTMLImageElement | HTMLCanvasElement;
  pos: Position;
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
    // this.renderingCtx.save();

    this.renderingCtx.lineWidth = lineWidth;
    this.renderingCtx.strokeStyle = color;

    this.renderingCtx.beginPath();

    this.renderingCtx.moveTo(start.x, start.y);
    this.renderingCtx.lineTo(end.x, end.y);

    this.renderingCtx.stroke();

    // this.renderingCtx.restore();
  }

  public fillRect({ pos, size, color = "#000" }: DrawRectConfig) {
    // this.renderingCtx.save();

    this.renderingCtx.fillStyle = color;
    this.renderingCtx.fillRect(pos.x, pos.y, size.width, size.height);

    // this.renderingCtx.restore();
  }

  public strokeRect({ pos, size, color = "#000" }: DrawRectConfig) {
    // this.renderingCtx.save();

    this.renderingCtx.strokeStyle = color;
    this.renderingCtx.strokeRect(pos.x, pos.y, size.width, size.height);

    // this.renderingCtx.restore();
  }

  public drawImg({ img, pos }: DrawImgconfig): void {
    // this.renderingCtx.drawImage(img, 0, 0, 32, 32, pos.x, pos.y, 64, 64);
    // this.renderingCtx.drawImage(img, pos.x, pos.y, 128, 128);
    this.renderingCtx.drawImage(img, pos.x, pos.y);
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
