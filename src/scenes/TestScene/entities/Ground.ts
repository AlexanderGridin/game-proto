import { TestScene } from "..";
import { GameObject, State } from "../../../modules";

export class Ground extends GameObject {
  constructor(scene: TestScene) {
    super({ scene, imgAssetId: "grass-tile" });
  }

  public update(): void {}

  public render(): void {
    const gridRows = State.getGridRows();
    if (!gridRows.length) return;

    gridRows.forEach((row) => {
      row.cells.forEach((cell) => {
        this.scene.renderer.drawImg({
          img: this.imgAsset,
          pos: cell.pos,
        });
      });
    });
  }
}
