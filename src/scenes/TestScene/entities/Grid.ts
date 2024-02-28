import { TestScene } from "..";
import { GameObject } from "../../../modules";
import { globalState } from "../../../state";
import { GridCell, GridRow } from "../../../types";
import { drawGrid } from "../../../utils";

export class Grid extends GameObject<TestScene> {
  private gridRows: GridRow[] = globalState.get("gridRows");

  private rowToHighlight: GridRow | null = null;
  private cellToHighlight: GridCell | null = null;

  constructor(scene: TestScene) {
    super({ scene });
  }

  public update(): void {
    if (this.rowToHighlight && this.isInRowBoundaries(this.rowToHighlight)) {
      if (
        this.cellToHighlight &&
        this.isInCellBoundaries(this.cellToHighlight)
      ) {
        return;
      }
    }

    const row = this.gridRows.find((row) => this.isInRowBoundaries(row));
    if (!row) {
      this.rowToHighlight = null;
      return;
    }

    this.rowToHighlight = row;

    const cell = row.cells.find((cell) => this.isInCellBoundaries(cell));
    this.cellToHighlight = cell ?? null;
  }

  private isInRowBoundaries(row: GridRow): boolean {
    const mouse = this.scene.mouse;
    return mouse.pos.y > row.vStart && mouse.pos.y < row.vEnd;
  }

  private isInCellBoundaries(cell: GridCell): boolean {
    const mouseX = this.scene.mouse.pos.x;
    const mouseY = this.scene.mouse.pos.y;

    return (
      mouseX >= cell.pos.x &&
      mouseX <= cell.pos.x + cell.size.width &&
      mouseY >= cell.pos.y &&
      mouseY <= cell.pos.y + cell.size.height
    );
  }

  public render(): void {
    drawGrid(this.scene.renderer, globalState.get("gridRows"));

    if (!this.rowToHighlight || !this.cellToHighlight) return;

    this.rowToHighlight.cells.forEach((cell) => {
      this.scene.renderer.fillRect({
        pos: cell.pos,
        size: cell.size,
        color: "rgba(46, 52, 64, 0.1)",
      });
    });

    this.scene.renderer.fillRect({
      pos: this.cellToHighlight.pos,
      size: this.cellToHighlight.size,
      color: "rgba(46, 52, 64, 0.3)",
    });
  }
}
