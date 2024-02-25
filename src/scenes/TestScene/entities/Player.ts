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

  public velocity = 5;

  constructor(scene: TestScene) {
    super({ scene, imgAssetId: "player" });
  }

  public update(): void {}

  public render(): void {
    this.scene.renderer.fillRect({
      pos: this.pos,
      size: this.size,
      color: "#eed089",
    });
  }
}
