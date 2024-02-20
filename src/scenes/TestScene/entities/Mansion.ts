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
    this.scene.renderer.drawImg({
      img: this.imgAsset,
      pos: this.pos,
    });
  }
}
