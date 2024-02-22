import { GameObject, State } from "../../../modules";
import { Position, Size } from "../../../types";
import { TestScene } from "../TestScene";

export class TestEntity extends GameObject {
  public pos: Position = {
    x: 1 * State.getCellSize(),
    y: 8 * State.getCellSize(),
  };

  public size: Size = {
    width: State.getCellSize(),
    height: State.getCellSize(),
  };

  constructor(scene: TestScene) {
    super({ scene, imgAssetId: "player" });
  }

  public update(): void {}

  public render(): void {
    this.scene.renderer.drawImg({
      img: this.imgAsset,
      pos: this.pos,
    });

    // this.scene.renderer.strokeRect({
    //   pos: this.pos,
    //   size: this.size,
    //   color: "red",
    // });
  }
}
