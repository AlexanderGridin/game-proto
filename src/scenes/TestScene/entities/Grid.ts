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

  private playerHoveredRows: GridRow[] = [];
  private playerHoveredCells: (GridCell | null)[] = [];
  private emitedObject: any | null = null;

  private preRenderer: Renderer;
  private isRender = false;

  private size: Size;
  private cellClickListeners: ((cell: GridCell) => void)[] = [];
  private hoveredObject: any | null = null;

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
      if (this.hoveredCell) {
        this.cellClickListeners.forEach((listener) => {
          if (this.hoveredCell) {
            listener(this.hoveredCell);
          }
        });
      }
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
      this.isRender = !this.isRender;
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

    const os = this.playerHoveredCells
      .map((cell) => this.scene.map.itemsRegirsty[cell?.index ?? -1])
      .filter((o) => Boolean(o));
    if (!os.length) return;
    const o = os[0];

    if (this.emitedObject !== o) {
      this.emitedObject = o;
      this.scene.player.setHoveredObject(o);
    }
  }

  private rectCollision(cell: GridCell): boolean {
    const player = this.scene.player;
    const camera = this.scene.camera;

    return (
      player.pos.x < cell.pos.x + cell.size.width + camera.pos.x &&
      player.pos.x + player.size.width > cell.pos.x + camera.pos.x &&
      player.pos.y < cell.pos.y + cell.size.height + camera.pos.y &&
      player.pos.y + player.size.height > cell.pos.y + camera.pos.y
    );
  }

  private isPlayerInRow(row: GridRow): boolean {
    const player = this.scene.player;
    const camera = this.scene.camera;

    return (
      player.pos.y + player.size.height > camera.pos.y + row.vStart &&
      player.pos.y < camera.pos.y + row.vEnd
    );
  }

  private handleMouseHover(): void {
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

    if (this.hoveredCell) {
      const o = this.scene.map.itemsRegirsty[this.hoveredCell.index];
      this.hoveredObject = o ?? null;
    }
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
    if (this.isRender) {
      this.scene.renderer.drawImg({
        img: this.preRenderer.canvas,
        pos: this.scene.camera.pos,
      });
    }

    // this.renderRow();
    this.renderCell();
  }

  // private renderRow(): void {
  //   this.playerHoveredRows.forEach((row) => {
  //     row.cells.forEach((cell) => {
  //       this.scene.renderer.fillRect({
  //         pos: {
  //           x: cell.pos.x + this.scene.camera.pos.x,
  //           y: cell.pos.y + this.scene.camera.pos.y,
  //         },
  //         size: cell.size,
  //         color: "rgba(46, 52, 64, 0.1)",
  //       });
  //     });
  //   });
  // }

  private renderCell(): void {
    if (this.playerHoveredCells.length) {
      this.playerHoveredCells.forEach((cell) => {
        if (!cell) return;
        // this.scene.renderer.fillRect({
        //   pos: {
        //     x: cell.pos.x + this.scene.camera.pos.x,
        //     y: cell.pos.y + this.scene.camera.pos.y,
        //   },
        //   size: cell.size,
        //   color: "rgba(255, 0, 0, 0.3)",
        // });

        const o = this.scene.map.itemsRegirsty[cell.index];

        if (o) {
          this.scene.renderer.strokeRect({
            pos: {
              x: cell.pos.x + this.scene.camera.pos.x,
              y: cell.pos.y + this.scene.camera.pos.y,
            },
            size: cell.size,
            color: "black",
          });
        }
      });
    }

    if (this.hoveredObject) {
      this.scene.renderer.fillRect({
        pos: {
          x: this.hoveredObject.pos.x + this.scene.camera.pos.x,
          y: this.hoveredObject.pos.y + this.scene.camera.pos.y,
        },
        size: this.hoveredCell!.size,
        color: "rgba(0, 255, 0, 0.3)",
      });
    }
  }
}
