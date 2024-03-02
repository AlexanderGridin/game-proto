import { TestScene } from "..";
import { GameObject, Renderer } from "../../../modules";
import { Keyboard } from "../../../modules/Keyboard";
import { KeyboardKeyCode } from "../../../modules/Keyboard/enums";
import { globalState } from "../../../state";
import { Position, Size } from "../../../types";
import { Bush } from "../game-items/Bush";
import { Chop } from "../game-items/Chop";
import { Collider, GameItem, GameItemType } from "../game-items/GameItem";
import { Stone } from "../game-items/Stone";
import { Direction } from "./Camera";
import { Grid } from "./Grid";

export class GameMap extends GameObject<TestScene> {
  public pos = new Position();
  public size: Size = globalState.get("chunkSize");
  public grid: Grid;

  private preRenderer = new Renderer({ size: this.size });

  private collidersRenderer = new Renderer({
    size: this.size,
  });
  private collidersData: Uint8ClampedArray | null = null;
  private colliders: Collider[] = [];
  private isRenderColliders = false;

  public itemsRegistry: Map<number, GameItem> = new Map();
  private itemsRenderer = new Renderer({
    size: this.size,
  });

  constructor(scene: TestScene) {
    super({ scene, imgAssetId: "tiles" });

    this.grid = new Grid(scene, this.size);

    this.preRender();
    this.alignCamera();

    this.grid.onCellClick((cell) => {
      const obj = this.itemsRegistry.get(cell.index);
      if (!obj) return;
    });
  }

  private alignCamera(): void {
    if (this.size.width < this.scene.camera.size.width) {
      const x = (this.scene.camera.size.width - this.size.width) / 2;

      this.scene.camera.setPos({
        ...this.scene.camera.pos,
        x,
      });
    }
  }

  private preRender(): void {
    this.renderMap();

    this.initItems();
    this.renderItems();

    this.renderBoundaries();
  }

  private renderBoundaries(): void {
    this.collidersRenderer.clear();

    this.colliders.forEach((boundary) => {
      this.collidersRenderer.fillRect({
        pos: boundary.pos,
        size: boundary.size,
        color: "rgb(255, 0, 0)",
      });
    });

    this.collidersData = this.collidersRenderer.TMPctx.getImageData(
      0,
      0,
      this.collidersRenderer.width,
      this.collidersRenderer.height,
    ).data;
  }

  private initItems(): void {
    const layersData = globalState.get("mapLayers");
    const layer = layersData.find(
      (layer: any) => layer.name === "objects",
    ).data;
    const gridRows = this.grid.rows;

    gridRows.forEach((row) => {
      row.cells.forEach((cell) => {
        const tileCode = layer[cell.index];

        if (tileCode === 0) return;

        let item: GameItem | null = null;

        if (tileCode === 325) {
          item = new Stone({
            pos: cell.pos,
            cellIndex: cell.index,
          });
        }

        if (tileCode === 326) {
          item = new Bush({
            pos: cell.pos,
            cellIndex: cell.index,
          });
        }

        if (tileCode === 327) {
          item = new Chop({
            pos: cell.pos,
            cellIndex: cell.index,
          });
        }

        if (!item) return;

        this.itemsRegistry.set(cell.index, item);
        this.colliders.push(item.collider);
      });
    });
  }

  private renderItems(): void {
    const cellSize = globalState.get("cellSize");
    const img = document.querySelector<HTMLImageElement>("#tiles2")!;

    let sx = 0;
    const sy = 2 * cellSize;

    const { Bush, Stone, Chop } = GameItemType;

    this.itemsRenderer.clear();
    this.itemsRegistry.forEach((item) => {
      const dx = item.pos.x;
      const dy = item.pos.y;

      switch (item.type) {
        case Bush:
          sx = cellSize;
          break;

        case Stone:
          sx = 0;
          break;

        case Chop:
          sx = 2 * cellSize;
          break;
      }

      this.itemsRenderer.TMPctx.drawImage(
        img,
        sx,
        sy,
        cellSize,
        cellSize,
        dx,
        dy,
        cellSize,
        cellSize,
      );
    });
  }

  private renderMap(): void {
    const layersData = globalState.get("mapLayers");
    const mapLayer = layersData.find((layer: any) => layer.name === "map");
    const cellSize = globalState.get("cellSize");

    const img = document.querySelector<HTMLImageElement>("#tiles2")!;
    const gridCells = this.grid.rows.flatMap((row) => row.cells);

    gridCells.forEach((cell, index) => {
      let sx = 0;
      const sy = 0;

      const dx = cell.pos.x;
      const dy = cell.pos.y;

      const tileCode = mapLayer.data[index];

      if (tileCode === 305) {
        // grass
        sx = 0;
      }

      if (tileCode === 306) {
        // grass2
        sx = cellSize;
      }

      if (tileCode === 307) {
        // water
        sx = 2 * cellSize;
      }

      if (tileCode === 308) {
        // dirt
        // sx = 3 * cellSize;
        // grass
        sx = 0;
      }

      this.preRenderer.TMPctx.drawImage(
        img,
        sx,
        sy,
        cellSize,
        cellSize,
        dx,
        dy,
        cellSize,
        cellSize,
      );
    });
  }

  public removeItem(item: GameItem): void {
    this.itemsRegistry.delete(item.cellIndex);
    this.colliders = this.colliders.filter((i) => i.parentId !== item.id);
    this.renderItems();
    this.renderBoundaries();
  }

  public update(): void {
    if (Keyboard.isKeyClicked(KeyboardKeyCode.U)) {
      this.isRenderColliders = !this.isRenderColliders;
    }

    this.grid.update();
    this.checkCollisionWithPlayer();
  }

  private getBoundariesData(pos: Position) {
    if (!this.collidersData) return;

    const { x, y } = pos;
    const r =
      this.collidersData[
        (this.size.width * (y - this.scene.camera.pos.y) +
          (x - this.scene.camera.pos.x)) *
          4
      ];

    return r === 255;
  }

  private rectCollision(
    a: { pos: Position; size: Size },
    b: { pos: Position; size: Size },
  ): boolean {
    return (
      a.pos.x < b.pos.x + b.size.width &&
      a.pos.x + a.size.width > b.pos.x &&
      a.pos.y < b.pos.y + b.size.height &&
      a.pos.y + a.size.height > b.pos.y
    );
  }

  private isBoundaryCollision(player: { pos: Position; size: Size }): boolean {
    const isTopLeft = this.getBoundariesData(player.pos);

    const isBootomLeft = this.getBoundariesData({
      x: player.pos.x,
      y: player.pos.y + player.size.height,
    });

    const isTopRight = this.getBoundariesData({
      x: player.pos.x + player.size.width,
      y: player.pos.y,
    });

    const isBottomRight = this.getBoundariesData({
      x: player.pos.x + player.size.width,
      y: player.pos.y + player.size.height,
    });

    return Boolean(isTopLeft || isTopRight || isBootomLeft || isBottomRight);
  }

  private checkCollisionWithPlayer(): void {
    const player = this.scene.player;
    const camera = this.scene.camera;

    const isCollision = this.isBoundaryCollision(player.collider);
    if (!isCollision) return;

    const boundary = this.colliders.find((boundary) => {
      return this.rectCollision(
        {
          pos: {
            x: camera.pos.x + boundary.pos.x,
            y: camera.pos.y + boundary.pos.y,
          },
          size: boundary.size,
        },
        player.collider,
      );
    });

    if (!boundary) return;

    const { Left, Right, Top, Bottom } = Direction;

    switch (camera.direction) {
      case Left: {
        const x =
          player.collider.pos.x - (boundary.pos.x + boundary.size.width);
        camera.setPos({
          ...camera.pos,
          x,
        });

        break;
      }

      case Right: {
        const x =
          player.collider.pos.x + player.collider.size.width - boundary.pos.x;
        camera.setPos({
          ...camera.pos,
          x,
        });

        break;
      }

      case Top: {
        const y =
          player.collider.pos.y - (boundary.pos.y + boundary.size.height);
        camera.setPos({
          ...camera.pos,
          y,
        });

        break;
      }

      case Bottom: {
        const y =
          player.collider.pos.y + player.collider.size.height - boundary.pos.y;
        camera.setPos({
          ...camera.pos,
          y,
        });

        break;
      }
    }
  }

  public render(): void {
    this.drawMap();
    this.drawItems();
    this.drawColliders();

    this.grid.render();
  }

  private drawMap(): void {
    this.scene.renderer.drawImg({
      img: this.preRenderer.canvas,
      pos: this.scene.camera.pos,
    });
  }

  private drawItems(): void {
    this.scene.renderer.drawImg({
      img: this.itemsRenderer.canvas,
      pos: this.scene.camera.pos,
    });
  }

  private drawColliders(): void {
    if (!this.isRenderColliders) return;

    this.scene.renderer.drawImg({
      img: this.collidersRenderer.canvas,
      pos: this.scene.camera.pos,
    });
  }
}
