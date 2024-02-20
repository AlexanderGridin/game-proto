import { State } from "../../../modules";
import { Position, Size } from "../../../types";
import { TestScene } from "../TestScene";

export class TestEntity {
  private scene: TestScene;

  public pos: Position = {
    x: 1 * State.getCellSize(),
    y: 8 * State.getCellSize(),
  };

  public size: Size = {
    width: State.getCellSize(),
    height: State.getCellSize(),
  };

  private asset: HTMLImageElement;

  constructor(scene: TestScene) {
    this.scene = scene;

    const asset = document.getElementById("player");
    if (!asset) {
      throw new Error("Unable to grab asset");
    }

    this.asset = asset as HTMLImageElement;
  }

  public update(): void {}

  public render(): void {
    this.scene.renderer.TMPctx.drawImage(this.asset, this.pos.x, this.pos.y);

    this.scene.renderer.strokeRect({
      pos: this.pos,
      size: this.size,
      color: "red",
    });
  }
}
