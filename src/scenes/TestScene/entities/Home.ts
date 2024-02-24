import { TestScene } from "..";
import { GameObject } from "../../../modules";
import { globalState } from "../../../state";

export class Home extends GameObject {
  constructor(scene: TestScene) {
    super({ scene });
  }

  public renderOn(ctx: CanvasRenderingContext2D): void {
    const cellSize = globalState.get("cellSize");

    ctx.fillStyle = "#d58772";
    ctx.beginPath();
    ctx.moveTo(2 * cellSize, 5 * cellSize);
    ctx.lineTo(4 * cellSize, 1 * cellSize);
    ctx.lineTo(6 * cellSize, 5 * cellSize);
    ctx.fill();
  }

  public render(): void {}
  public update(): void {}
}
