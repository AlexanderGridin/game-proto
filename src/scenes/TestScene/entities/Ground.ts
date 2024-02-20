import { TestScene } from "..";
import { State } from "../../../modules";

export class Ground {
  private scene: TestScene;
  private asset: HTMLImageElement;

  constructor(scene: TestScene) {
    this.scene = scene;

    const asset = document.getElementById("grass-tile");
    if (!asset) throw new Error("Unable to get asset for Map");
    this.asset = asset as HTMLImageElement;
  }

  public render(): void {
    const gridRows = State.getGridRows();
    if (!gridRows.length) return;

    gridRows.forEach((row) => {
      row.cells.forEach((cell) => {
        this.scene.renderer.TMPctx.drawImage(
          this.asset,
          cell.pos.x,
          cell.pos.y,
        );
      });
    });
  }
}
