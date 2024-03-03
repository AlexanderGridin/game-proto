import { TestScene } from "..";
import { GameObject, Renderer } from "../../../modules";
import { Keyboard } from "../../../modules/Keyboard";
import { KeyboardKeyCode } from "../../../modules/Keyboard/enums";
import { globalState } from "../../../state";
import { GridCell, GridRow, Position, Size } from "../../../types";
import { initGrid } from "../../../utils";

export class Grid extends GameObject<TestScene> {
  public rows: GridRow[] = [];

  private hoveredRow: GridRow | null = null;
  private hoveredCell: GridCell | null = null;

  private playerHoveredRows: GridRow[] = [];
  private playerHoveredCells: (GridCell | null)[] = [];
  private emitedObject: any | null = null;

  private preRenderer: Renderer;
  private isDrawGrid = false;

  public size: Size;
  public pos = new Position();

  private cellClickListeners: ((cell: GridCell) => void)[] = [];
  private hoveredItem: any | null = null;

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
      if (!this.hoveredCell) return;

      this.cellClickListeners.forEach((listener) => {
        if (!this.hoveredCell) return;
        listener(this.hoveredCell);
      });
    });
  }

  public onCellClick(listener: (cell: GridCell) => void): void {
    this.cellClickListeners.push(listener);
  }

  private preRender(): void {
    const lineWidth = 0.5;
    const color = "rgba(0,0,0,0.3)";

    this.rows.forEach((row) => {
      const rowY = row.vStart - 0.5;

      // horizontal lines
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

      if (row.index === 0) {
        row.cells.forEach((cell) => {
          const cellX = cell.pos.x - 0.5;

          // vertical lines
          this.preRenderer.drawLine({
            start: { x: cellX, y: 0 },
            end: { x: cellX, y: this.size.height },
            lineWidth,
            color,
          });
        });
      }
    });
  }

  public update(): void {
    if (Keyboard.isKeyClicked(KeyboardKeyCode.G)) {
      this.isDrawGrid = !this.isDrawGrid;
    }

    this.handleMouseHover();
    this.handlePlayerHover();
  }

  private handlePlayerHover(): void {
    const rows = this.rows.filter((row) => this.isPlayerInRow(row));
    this.playerHoveredRows = rows;

    if (!this.playerHoveredRows.length) return;

    const cells = this.playerHoveredRows
      .flatMap((row) => row.cells)
      .filter((cell) => this.rectCollision(cell));

    this.playerHoveredCells = cells;

    if (!this.playerHoveredCells.length) return;

    const cellsItems = this.playerHoveredCells
      .map((cell) => this.scene.map.itemsRegistry.get(cell?.index ?? -1))
      .filter((item) => Boolean(item));

    if (!cellsItems.length) {
      this.emitedObject = null;
      this.scene.player.setHoveredItem(null);
      return;
    }

    const item = cellsItems[0];

    if (item && this.emitedObject !== item) {
      this.emitedObject = item;
      this.scene.player.setHoveredItem(item);
    }
  }

  private rectCollision(cell: GridCell): boolean {
    const player = this.scene.player;
    const camera = this.scene.camera;

    return (
      player.pos.x < cell.pos.x + cell.size.width + camera.offset.x &&
      player.pos.x + player.size.width > cell.pos.x + camera.offset.x &&
      player.pos.y < cell.pos.y + cell.size.height + camera.offset.y &&
      player.pos.y + player.size.height > cell.pos.y + camera.offset.y
    );
  }

  private isPlayerInRow(row: GridRow): boolean {
    const player = this.scene.player;
    const camera = this.scene.camera;

    return (
      player.pos.y + player.size.height > camera.offset.y + row.vStart &&
      player.pos.y < camera.offset.y + row.vEnd
    );
  }

  private handleMouseHover(): void {
    if (
      this.hoveredRow &&
      this.isInRowBoundaries(this.hoveredRow) &&
      this.hoveredCell &&
      this.isInCellBoundaries(this.hoveredCell)
    ) {
      return;
    }

    const row = this.rows.find((row) => this.isInRowBoundaries(row));
    if (!row) {
      this.hoveredRow = null;
      return;
    }

    this.hoveredRow = row;

    const cell = row.cells.find((cell) => this.isInCellBoundaries(cell));
    this.hoveredCell = cell ?? null;

    if (this.hoveredCell) {
      const item = this.scene.map.itemsRegistry.get(this.hoveredCell.index);
      this.hoveredItem = item ?? null;
    }
  }

  private isInRowBoundaries(row: GridRow): boolean {
    const mouse = this.scene.mouse;
    return (
      mouse.pos.y > this.scene.camera.offset.y + row.vStart &&
      mouse.pos.y < this.scene.camera.offset.y + row.vEnd
    );
  }

  private isInCellBoundaries(cell: GridCell): boolean {
    const mouseX = this.scene.mouse.pos.x;
    const mouseY = this.scene.mouse.pos.y;

    const camera = this.scene.camera;

    return (
      mouseX >= cell.pos.x + camera.offset.x &&
      mouseX <= cell.pos.x + cell.size.width + camera.offset.x &&
      mouseY >= cell.pos.y + camera.offset.y &&
      mouseY <= cell.pos.y + cell.size.height + camera.offset.y
    );
  }

  public render(): void {
    this.drawGrid();
    this.drawCell();
    this.drawHoveredItemHover();
  }

  private drawGrid(): void {
    if (!this.isDrawGrid) return;

    this.scene.renderer.drawImg({
      img: this.preRenderer.canvas,
      pos: this.scene.camera.offset,
    });
  }

  private drawCell(): void {
    if (!this.playerHoveredCells.length) return;

    this.playerHoveredCells.forEach((cell) => {
      if (!cell) return;

      const item = this.scene.map.itemsRegistry.get(cell.index);
      if (item) {
        this.scene.renderer.strokeRect({
          pos: {
            x: cell.pos.x + this.scene.camera.offset.x,
            y: cell.pos.y + this.scene.camera.offset.y,
          },
          size: cell.size,
          color: "black",
        });
      }
    });
  }

  private drawHoveredItemHover(): void {
    if (!this.hoveredItem) return;

    this.scene.renderer.fillRect({
      pos: {
        x: this.hoveredItem.pos.x + this.scene.camera.offset.x,
        y: this.hoveredItem.pos.y + this.scene.camera.offset.y,
      },
      size: this.hoveredCell!.size,
      color: "rgba(0, 255, 0, 0.3)",
    });
  }
}
