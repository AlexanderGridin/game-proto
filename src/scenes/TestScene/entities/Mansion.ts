import { State } from "../../../modules";
import { Position } from "../../../types";
import { TestScene } from "../TestScene";

export class Mansion {
  private scene: TestScene;
  private asset: HTMLImageElement;

  public pos: Position = {
    x: 1 * State.getCellSize(),
    y: 1 * State.getCellSize(),
  };

  constructor(scene: TestScene) {
    this.scene = scene;

    const asset = document.getElementById("mansion");
    if (!asset) throw new Error("Unable to get asset for Mansion");
    this.asset = asset as HTMLImageElement;
  }

  public render(): void {
    this.scene.renderer.TMPctx.drawImage(this.asset, this.pos.x, this.pos.y);
  }
}
