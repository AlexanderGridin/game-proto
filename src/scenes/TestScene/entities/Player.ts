import { GameObject } from "../../../modules";
import { globalState } from "../../../state";
import { Position, Size } from "../../../types";
import { TestScene } from "../TestScene";

export class Player extends GameObject {
  private cellSize = globalState.get("cellSize");

  public pos: Position = {
    x: 7 * this.cellSize,
    y: 6 * this.cellSize,
  };

  public size: Size = {
    width: this.cellSize,
    height: this.cellSize,
  };

  private velocity = 5;

  constructor(scene: TestScene) {
    super({ scene, imgAssetId: "player" });
  }

  public update(): void {
    this.pos.y += this.velocity;

    if (
      this.pos.y + this.size.height >= this.scene.renderer.height ||
      this.pos.y <= 0
    ) {
      this.velocity *= -1;
    }
  }

  public render(): void {
    this.scene.renderer.fillRect({
      pos: this.pos,
      size: this.size,
      color: "#5a81aa",
    });
  }
}
