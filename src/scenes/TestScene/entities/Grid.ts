import { TestScene } from "..";
import { GameObject, Renderer } from "../../../modules";
import { Keyboard } from "../../../modules/Keyboard";
import { KeyboardKeyCode } from "../../../modules/Keyboard/enums";
import { globalState } from "../../../state";
import { GridCell, GridRow, Size } from "../../../types";
import { initGrid } from "../../../utils";

export class Grid extends GameObject<TestScene> {
  public rows: GridRow[] = [];

  private hoveredRow: GridRow | null = null;
  private hoveredCell: GridCell | null = null;

  private preRenderer: Renderer;
  private isRender = false;

  private size: Size;

  constructor(scene: TestScene, size: Size) {
    super({ scene });

    this.size = size;
    this.preRenderer = new Renderer({ size });

    const cellSize = globalState.get("cellSize");
    this.rows = initGrid({
      size,
      cellSize,
    });

    this.preRender();

    this.scene.mouse.onClick(() => {
      if (!this.isRender) return;
      console.log(this.hoveredCell);

      if (this.hoveredCell) {
        this.scene.map.pushBoundary({
          pos: this.hoveredCell.pos,
          size: this.hoveredCell.size,
          offset: this.hoveredCell.pos,
        });
      }
    });
  }

  private preRender(): void {
    const lineWidth = 0.5;
    const color = "rgba(0,0,0,0.3)";

    this.rows.forEach((row) => {
      const rowY = row.vStart - 0.5;

      this.preRenderer.drawLine({
        start: {
          x: 0,
          y: rowY,
        },
        end: {
          x: this.size.width,
          y: rowY,
        },
        lineWidth,
        color,
      });
    });

    this.rows[0].cells.forEach((cell) => {
      const cellX = cell.pos.x - 0.5;

      this.preRenderer.drawLine({
        start: { x: cellX, y: 0 },
        end: { x: cellX, y: this.size.height },
        lineWidth,
        color,
      });
    });
  }

  public update(): void {
    if (Keyboard.isKeyClicked(KeyboardKeyCode.F)) {
      this.isRender = !this.isRender;
    }

    if (!this.isRender) return;

    if (this.hoveredRow && this.isInRowBoundaries(this.hoveredRow)) {
      if (this.hoveredCell && this.isInCellBoundaries(this.hoveredCell)) {
        return;
      }
    }

    const row = this.rows.find((row) => this.isInRowBoundaries(row));
    if (!row) {
      this.hoveredRow = null;
      return;
    }

    this.hoveredRow = row;

    const cell = row.cells.find((cell) => this.isInCellBoundaries(cell));
    this.hoveredCell = cell ?? null;
  }

  private isInRowBoundaries(row: GridRow): boolean {
    const mouse = this.scene.mouse;
    return (
      mouse.pos.y > this.scene.camera.pos.y + row.vStart &&
      mouse.pos.y < this.scene.camera.pos.y + row.vEnd
    );
  }

  private isInCellBoundaries(cell: GridCell): boolean {
    const mouseX = this.scene.mouse.pos.x;
    const mouseY = this.scene.mouse.pos.y;

    const camera = this.scene.camera;

    return (
      mouseX >= cell.pos.x + camera.pos.x &&
      mouseX <= cell.pos.x + cell.size.width + camera.pos.x &&
      mouseY >= cell.pos.y + camera.pos.y &&
      mouseY <= cell.pos.y + cell.size.height + camera.pos.y
    );
  }

  public render(): void {
    if (!this.isRender) return;

    this.scene.renderer.drawImg({
      img: this.preRenderer.canvas,
      pos: this.scene.camera.pos,
    });

    // this.renderRow();
    this.renderCell();
  }

  private renderRow(): void {
    if (!this.hoveredRow) return;

    this.hoveredRow.cells.forEach((cell) => {
      this.scene.renderer.fillRect({
        pos: {
          x: cell.pos.x + this.scene.camera.pos.x,
          y: cell.pos.y + this.scene.camera.pos.y,
        },
        size: cell.size,
        color: "rgba(46, 52, 64, 0.1)",
      });
    });
  }

  private renderCell(): void {
    if (!this.hoveredCell) return;

    const cell = this.hoveredCell;
    this.scene.renderer.fillRect({
      pos: {
        x: cell.pos.x + this.scene.camera.pos.x,
        y: cell.pos.y + this.scene.camera.pos.y,
      },
      size: this.hoveredCell.size,
      color: "rgba(46, 52, 64, 0.3)",
    });
  }
}
