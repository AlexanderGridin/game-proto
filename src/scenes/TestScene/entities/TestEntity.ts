import { GameObject, State } from "../../../modules";
import { Position, Size } from "../../../types";
import { TestScene } from "../TestScene";

export class TestEntity extends GameObject {
  private cellSize = State.getCellSize();

  public pos: Position = {
    x: 1 * this.cellSize,
    y: 8 * this.cellSize,
  };

  public size: Size = {
    width: this.cellSize,
    height: this.cellSize,
  };

  constructor(scene: TestScene) {
    super({ scene, imgAssetId: "player" });
  }

  public update(): void {}

  public render(): void {
    this.scene.renderer.drawRect({
      pos: this.pos,
      size: this.size,
      color: "#5a81aa",
    });
  }
}
