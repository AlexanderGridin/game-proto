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

export class Renderer {
  private renderingCtx: CanvasRenderingContext2D;

  constructor(canvasElementId: string) {
    const canvasElement =
      document.querySelector<HTMLCanvasElement>(canvasElementId);
    if (!canvasElement) {
      throw new Error("Unable to find canvas element for provided id");
    }

    const ctx = canvasElement.getContext("2d");
    if (!ctx) {
      throw new Error("Unable to get canvas 2d rendering context");
    }

    this.renderingCtx = ctx;
  }

  public drawLine({
    start,
    end,
    color = "#000",
    lineWidth = 1,
  }: DrawLineConfig): void {
    this.renderingCtx.save();

    this.renderingCtx.lineWidth = lineWidth;
    this.renderingCtx.strokeStyle = color;

    this.renderingCtx.beginPath();

    this.renderingCtx.moveTo(start.x, start.y);
    this.renderingCtx.lineTo(end.x, end.y);

    this.renderingCtx.stroke();

    this.renderingCtx.restore();
  }

  public drawRect({ pos, size, color = "#000" }: DrawRectConfig) {
    this.renderingCtx.save();

    this.renderingCtx.fillStyle = color;
    this.renderingCtx.fillRect(pos.x, pos.y, size.width, size.height);

    this.renderingCtx.restore();
  }

  public strokeRect({ pos, size, color = "#000" }: DrawRectConfig) {
    this.renderingCtx.save();

    this.renderingCtx.strokeStyle = color;
    this.renderingCtx.strokeRect(pos.x, pos.y, size.width, size.height);

    this.renderingCtx.restore();
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
}
