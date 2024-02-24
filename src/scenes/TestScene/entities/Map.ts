import { TestScene } from "..";
import { GameObject, Renderer, State } from "../../../modules";

export class Map extends GameObject<TestScene> {
  private preRenderer = new Renderer();

  constructor(scene: TestScene) {
    super({ scene, imgAssetId: "grass-tile" });

    this.preRender();
  }

  private preRender(): void {
    this.preRenderBG();
    this.scene.home.renderOn(this.preRenderer.TMPctx);
  }

  private preRenderBG(): void {
    const gridRows = State.getGridRows();

    gridRows.forEach((row) => {
      row.cells.forEach((cell) => {
        this.preRenderer.fillRect({
          pos: cell.pos,
          size: cell.size,
          color: "#90c78a",
        });
      });
    });
  }

  public update(): void {}

  public render(): void {
    this.scene.renderer.drawImg({
      img: this.preRenderer.canvas,
      pos: { x: 0, y: 0 },
    });
  }
}
