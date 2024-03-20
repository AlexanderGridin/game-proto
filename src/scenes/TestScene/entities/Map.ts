import { TestScene } from "..";
import { Collider, GameObject, Renderer, SpriteSheet } from "../../../modules";
import { Keyboard } from "../../../modules/Keyboard";
import { KeyboardKeyCode } from "../../../modules/Keyboard/enums";
import { globalState } from "../../../state";
import { Position, PositionData, Size } from "../../../types";
import {
  getItemForMapCell,
  getItemSpriteFrame,
  getMapSpriteFrameByCode,
  isSimpleRectCollision,
} from "../../../utils";
import { isBush } from "../game-items";
import { GameItem } from "../game-items/GameItem";
import { Direction } from "./Camera";
import { Grid } from "./Grid";
import { ItemsProgress } from "./ItemsProgress";
import { Player } from "./Player";

export class GameMap extends GameObject<TestScene> {
  public pos = new Position();
  public size: Size = globalState.get("chunkSize");
  public grid: Grid;

  private preRenderer = new Renderer({ size: this.size });

  private collidersRenderer = new Renderer({
    size: this.size,
  });
  private collidersData: Uint8ClampedArray | null = null;
  private colliders: (Collider<GameItem> | Collider)[] = [];
  private isRenderColliders = false;

  public itemsRegistry: Map<number, GameItem> = new Map();
  private itemsRenderer = new Renderer({
    size: this.size,
  });

  private progress: ItemsProgress;

  private cellSize = globalState.get("cellSize");
  private spriteSheet = new SpriteSheet({
    imgSelector: "#tiles2",
    frameSize: { width: this.cellSize, height: this.cellSize },
  });

  constructor(scene: TestScene) {
    super({ scene });

    this.grid = new Grid(scene, this.size);

    this.preRender();
    this.alignCamera();

    this.progress = new ItemsProgress(this.scene, this.itemsRegistry.size);

    this.grid.onCellClick((cell) => {
      const obj = this.itemsRegistry.get(cell.index);
      if (!obj) return;
    });
  }

  private alignCamera(): void {
    if (this.size.width < this.scene.camera.size.width) {
      const x = (this.scene.camera.size.width - this.size.width) / 2;

      const xPos = -x;
      const yPos = this.scene.camera.pos.y;
      this.scene.camera.pos.set(xPos, yPos);
    }
  }

  private preRender(): void {
    this.renderMap();

    this.initItems();
    this.renderItems();

    this.initMapBoundaries();
    this.renderBoundaries();
  }

  private initMapBoundaries(): void {
    const layersData = globalState.get("mapLayers");
    const colliders = layersData.find(
      (layer: any) => layer.name === "colliders",
    ).objects;

    for (let collider of colliders) {
      const newCollider = new Collider();
      const x = Math.trunc(Math.abs(collider.x));
      const y = Math.trunc(Math.abs(collider.y));
      newCollider.pos.set(x, y);

      const width = Math.trunc(collider.width);
      const height = Math.trunc(collider.height);
      newCollider.size = {
        width,
        height,
      };

      this.colliders.push(newCollider);
    }
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

    for (let row of gridRows) {
      for (let cell of row.cells) {
        const tileCode = layer[cell.index];

        const item = getItemForMapCell(tileCode, cell);
        if (!item) continue;

        if (isBush(item)) {
          item.onBerriesReady(() => {
            this.renderItems();
          });
        }

        this.itemsRegistry.set(cell.index, item);
        this.colliders.push(item.collider);
      }
    }
  }

  public renderItems(): void {
    this.itemsRenderer.clear();

    this.itemsRegistry.forEach((item) => {
      const frameToRender = getItemSpriteFrame(item, this.spriteSheet);
      if (!frameToRender) return;
      this.itemsRenderer.drawSpriteSheetFrame(frameToRender, item);
    });
  }

  private renderMap(): void {
    const layersData = globalState.get("mapLayers");
    const mapLayer = layersData.find((layer: any) => layer.name === "map");
    const gridCells = this.grid.rows.flatMap((row) => row.cells);
    const totalCells = gridCells.length;

    for (let i = 0; i < totalCells; i++) {
      const cell = gridCells[i];
      const tileCode = mapLayer.data[i];
      const spriteSheetFrame = getMapSpriteFrameByCode(
        tileCode,
        this.spriteSheet,
      );

      if (!spriteSheetFrame) return;

      this.preRenderer.drawSpriteSheetFrame(spriteSheetFrame, cell);
    }
  }

  public removeItem(item: GameItem): void {
    this.itemsRegistry.delete(item.cellIndex);
    this.colliders = this.colliders.filter(
      (collider) => collider.parent?.id !== item.id,
    );

    this.renderItems();
    this.renderBoundaries();
  }

  public update(): void {
    if (Keyboard.isKeyClicked(KeyboardKeyCode.U)) {
      this.isRenderColliders = !this.isRenderColliders;
    }

    this.grid.update();
    this.progress.update(this.itemsRegistry.size);
    this.checkCollisionWithPlayer();
  }

  private isBoundaryPixel(pos: PositionData): boolean {
    if (!this.collidersData) return false;

    const cameraOffset = this.scene.camera.offset;

    const { x, y } = pos;
    const r =
      this.collidersData[
        (this.size.width * (y - cameraOffset.y) + (x - cameraOffset.x)) * 4
      ];

    return r === 255;
  }

  private isBoundaryCollision(entity: {
    pos: PositionData;
    size: Size;
  }): boolean {
    const isTopLeft = this.isBoundaryPixel(entity.pos);

    const isBootomLeft = this.isBoundaryPixel({
      x: entity.pos.x,
      y: entity.pos.y + entity.size.height,
    });

    const isTopRight = this.isBoundaryPixel({
      x: entity.pos.x + entity.size.width,
      y: entity.pos.y,
    });

    const isBottomRight = this.isBoundaryPixel({
      x: entity.pos.x + entity.size.width,
      y: entity.pos.y + entity.size.height,
    });

    return isTopLeft || isTopRight || isBootomLeft || isBottomRight;
  }

  private findCollider(player: Player): Collider<GameItem> | Collider | null {
    const camera = this.scene.camera;
    const collider = this.colliders.find((collider) => {
      const colliderPos: PositionData = {
        x: camera.offset.x + collider.pos.x,
        y: camera.offset.y + collider.pos.y,
      };

      return isSimpleRectCollision(
        {
          pos: colliderPos,
          size: collider.size,
        },
        player.collider,
      );
    });

    return collider || null;
  }

  private checkCollisionWithPlayer(): void {
    const player = this.scene.player;
    const camera = this.scene.camera;

    const isCollision = this.isBoundaryCollision({
      pos: player.collider.pos.getData(),
      size: player.collider.size,
    });

    if (!isCollision) return;

    const collider = this.findCollider(player);
    if (!collider) return;

    const { Left, Right, Top, Bottom } = Direction;

    switch (player.direction) {
      case Left: {
        const x =
          camera.offset.x +
          collider.pos.x +
          collider.size.width -
          (player.collider.pos.x - player.pos.x);

        player.pos.setX(x);
        break;
      }

      case Right: {
        const x =
          camera.offset.x +
          collider.pos.x -
          player.collider.size.width -
          (player.collider.pos.x - player.pos.x);

        player.pos.setX(x);
        break;
      }

      case Top: {
        const y =
          camera.offset.y +
          collider.pos.y +
          collider.size.height -
          (player.collider.pos.y - player.pos.y);

        player.pos.setY(y);
        break;
      }

      case Bottom: {
        const y = camera.offset.y + collider.pos.y - player.size.height;

        player.pos.setY(y);
        break;
      }
    }
  }

  public render(): void {
    this.drawMap();
    this.drawItems();
    this.drawColliders();

    this.grid.render();
    this.progress.render();
  }

  private drawMap(): void {
    this.scene.renderer.drawImg({
      img: this.preRenderer.canvas,
      pos: this.scene.camera.offset,
    });
  }

  private drawItems(): void {
    this.scene.renderer.drawImg({
      img: this.itemsRenderer.canvas,
      pos: this.scene.camera.offset,
    });
  }

  private drawColliders(): void {
    if (!this.isRenderColliders) return;

    this.scene.renderer.drawImg({
      img: this.collidersRenderer.canvas,
      pos: this.scene.camera.offset,
    });
  }
}
