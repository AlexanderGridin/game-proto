import { GameObject, State } from "../../../modules";
import { Position } from "../../../types";
import { TestScene } from "../TestScene";

export class Mansion extends GameObject {
  public pos: Position = {
    x: 1 * State.getCellSize(),
    y: 1 * State.getCellSize(),
  };

  constructor(scene: TestScene) {
    super({ scene, imgAssetId: "mansion" });
  }

  public update(): void {}

  public render(): void {
    const ctx = this.scene.renderer.TMPctx;
    const cellSize = State.getCellSize();

    ctx.fillStyle = "#d58772";
    ctx.beginPath();
    ctx.moveTo(3 * cellSize, 5 * cellSize);
    ctx.lineTo(5 * cellSize, 1 * cellSize);
    ctx.lineTo(7 * cellSize, 5 * cellSize);
    ctx.fill();
  }
}
