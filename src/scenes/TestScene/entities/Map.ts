import { TestScene } from "..";
import { GameObject, Renderer } from "../../../modules";
import { Keyboard } from "../../../modules/Keyboard";
import { KeyboardKeyCode } from "../../../modules/Keyboard/enums";
import { globalState } from "../../../state";
import { Position, Size } from "../../../types";
import { Direction } from "./Camera";
import { Grid } from "./Grid";

export class Map extends GameObject<TestScene> {
  public pos = new Position();
  public size: Size;
  public grid: Grid;

  private preRenderer = new Renderer({ size: globalState.get("chunkSize") });
  private boundariesPreRenderer = new Renderer({
    size: globalState.get("chunkSize"),
  });
  private boundariesData: Uint8ClampedArray | null = null;
  private boundaries: { pos: Position; size: Size; offset: Position }[] = [];
  private isRenderBoundaries = false;
  public objectsRegirsty: Record<number, any> = {};

  constructor(scene: TestScene) {
    super({ scene, imgAssetId: "tiles" });

    this.size = globalState.get("chunkSize");
    this.grid = new Grid(scene, this.size);

    this.preRender();
    this.alignCamera();

    this.grid.onCellClick((cell) => {
      const obj = this.objectsRegirsty[cell.index];
      if (!obj) return;
      console.log(obj.name, obj);
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
    this.preRenderMap();
    this.preRenderObjects();
    this.preRenderBoundaries();
  }

  private preRenderBoundaries(): void {
    const layersData = globalState.get("mapLayers");
    const layer = layersData.find((layer: any) => layer.name === "colliders");

    layer.objects.forEach((obj: any) => {
      const pos = {
        x: obj.x < 0 ? 0 : Math.floor(obj.x),
        y: obj.y < 0 ? 0 : Math.floor(obj.y),
      };

      this.boundaries.push({
        pos,
        size: {
          width: Math.floor(obj.width),
          height: Math.floor(obj.height),
        },
        offset: pos,
      });
    });

    this.boundaries.forEach((boundary) => {
      this.boundariesPreRenderer.fillRect({
        pos: boundary.pos,
        size: boundary.size,
        color: "rgb(255, 0, 0)",
      });
    });

    this.boundariesData = this.boundariesPreRenderer.TMPctx.getImageData(
      0,
      0,
      this.boundariesPreRenderer.width,
      this.boundariesPreRenderer.height,
    ).data;
  }

  private preRenderObjects(): void {
    const layersData = globalState.get("mapLayers");
    const objectsLayer = layersData.find(
      (layer: any) => layer.name === "objects",
    );
    const cellSize = globalState.get("cellSize");
    const img = document.querySelector<HTMLImageElement>("#tiles2")!;
    const gridCells = this.grid.rows.flatMap((row) => row.cells);

    gridCells.forEach((cell, index) => {
      let sx = 0;
      const sy = 2 * cellSize;

      const dx = cell.pos.x;
      const dy = cell.pos.y;

      const tileCode = objectsLayer.data[index];

      if (tileCode === 0) return;

      if (tileCode === 325) {
        // stone
        sx = 0;
        this.objectsRegirsty[index] = {
          pos: cell.pos,
          name: "stone",
        };
      }

      if (tileCode === 326) {
        // bush
        sx = cellSize;
        this.objectsRegirsty[index] = {
          pos: cell.pos,
          name: "bush",
        };
      }

      if (tileCode === 327) {
        // chop
        sx = 2 * cellSize;
        this.objectsRegirsty[index] = {
          pos: cell.pos,
          name: "chop",
        };
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

  private preRenderMap(): void {
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
        sx = 3 * cellSize;
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

  public pushBoundary(b: {
    pos: Position;
    size: Size;
    offset: Position;
  }): void {
    this.boundaries.push(b);
    this.preRenderBoundaries();
  }

  public update(): void {
    if (Keyboard.isKeyClicked(KeyboardKeyCode.J)) {
      this.isRenderBoundaries = !this.isRenderBoundaries;
    }

    this.grid.update();
    this.checkCollisionWithPlayer();
  }

  private getBoundariesData(pos: Position) {
    if (!this.boundariesData) return;

    const chunkWidth = globalState.get("chunkSize").width;
    const { x, y } = pos;
    const r =
      this.boundariesData[
        (chunkWidth * (y - this.scene.camera.pos.y) +
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

    const boundary = this.boundaries.find((boundary) => {
      return this.rectCollision(
        {
          pos: {
            x: camera.pos.x + boundary.offset.x,
            y: camera.pos.y + boundary.offset.y,
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
          player.collider.pos.x - (boundary.offset.x + boundary.size.width);
        camera.setPos({
          ...camera.pos,
          x,
        });

        break;
      }

      case Right: {
        const x =
          player.collider.pos.x +
          player.collider.size.width -
          boundary.offset.x;
        camera.setPos({
          ...camera.pos,
          x,
        });

        break;
      }

      case Top: {
        const y =
          player.collider.pos.y - (boundary.offset.y + boundary.size.height);
        camera.setPos({
          ...camera.pos,
          y,
        });

        break;
      }

      case Bottom: {
        const y =
          player.collider.pos.y +
          player.collider.size.height -
          boundary.offset.y;
        camera.setPos({
          ...camera.pos,
          y,
        });

        break;
      }
    }
  }

  public render(): void {
    this.renderMap();
    if (this.isRenderBoundaries) {
      this.renderBoundaries();
    }
    this.grid.render();
  }

  private renderMap(): void {
    this.scene.renderer.drawImg({
      img: this.preRenderer.canvas,
      pos: this.scene.camera.pos,
    });
  }

  private renderBoundaries(): void {
    this.scene.renderer.drawImg({
      img: this.boundariesPreRenderer.canvas,
      pos: this.scene.camera.pos,
    });
  }
}
