import { GameObject } from "../../../modules";
import { globalState } from "../../../state";
import { Position, Size } from "../../../types";
import { TestScene } from "../TestScene";

export class Player extends GameObject<TestScene> {
  private cellSize = globalState.get("cellSize");

  public pos: Position;

  public size: Size = {
    width: this.cellSize,
    height: this.cellSize * 2,
  };

  constructor(scene: TestScene) {
    super({ scene, imgAssetId: "player" });

    const camera = this.scene.camera;
    this.pos = {
      x: camera.size.width / 2 - this.size.width / 2,
      y: camera.size.height / 2 - this.size.height / 2,
    };
  }

  public update(): void {}

  public render(): void {
    this.scene.renderer.fillRect({
      pos: this.pos,
      size: this.size,
      color: "#eed089",
    });

    this.scene.renderer.TMPctx.fillStyle = "black";
    this.scene.renderer.TMPctx.fillText(
      `x: ${this.pos.x - this.scene.camera.pos.x}; y: ${this.pos.y - this.scene.camera.pos.y}`,
      this.pos.x,
      this.pos.y - 12,
    );
  }
}
