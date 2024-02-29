import { TestScene } from "..";
import { GameObject, Renderer } from "../../../modules";
import { globalState } from "../../../state";
import { Position, Size } from "../../../types";
import { Direction } from "./Camera";
import { Grid } from "./Grid";
import { Player } from "./Player";

export class Map extends GameObject<TestScene> {
  public pos = new Position();
  public size: Size;
  public grid: Grid;

  private preRenderer = new Renderer({ size: globalState.get("chunkSize") });
  private boundariesPreRenderer = new Renderer({
    size: globalState.get("chunkSize"),
  });
  private boundariesData: Uint8ClampedArray | null = null;
  private boundarySize = 16;
  private boundaries: { pos: Position; size: Size; offset: Position }[] = [
    {
      pos: this.pos,
      size: {
        width: globalState.get("chunkSize").width,
        height: this.boundarySize,
      },
      offset: {
        x: 0,
        y: 0,
      },
    },
    {
      pos: this.pos,
      size: {
        width: this.boundarySize,
        height: globalState.get("chunkSize").height,
      },
      offset: {
        x: 0,
        y: 0,
      },
    },
    {
      pos: {
        ...this.pos,
        x: this.pos.x + globalState.get("chunkSize").width - this.boundarySize,
      },
      size: {
        width: this.boundarySize,
        height: globalState.get("chunkSize").height,
      },
      offset: {
        x: globalState.get("chunkSize").width - this.boundarySize,
        y: 0,
      },
    },
    {
      pos: {
        ...this.pos,
        y: this.pos.y + globalState.get("chunkSize").height - this.boundarySize,
      },
      size: {
        width: globalState.get("chunkSize").width,
        height: this.boundarySize,
      },
      offset: {
        x: 0,
        y: globalState.get("chunkSize").height - this.boundarySize,
      },
    },
    {
      pos: {
        x: globalState.get("cellSize") * 2,
        y: globalState.get("cellSize") * 2,
      },
      size: {
        width: globalState.get("cellSize") * 3,
        height: globalState.get("cellSize") * 3,
      },
      offset: {
        x: globalState.get("cellSize") * 2,
        y: globalState.get("cellSize") * 2,
      },
    },
  ];

  constructor(scene: TestScene) {
    super({ scene, imgAssetId: "grass-tile" });

    this.size = globalState.get("chunkSize");
    this.grid = new Grid(scene, this.size);
    this.preRender();

    if (this.size.width < this.scene.camera.size.width) {
      const x = (this.scene.camera.size.width - this.size.width) / 2;
      this.scene.camera.setPos({
        ...this.scene.camera.pos,
        x,
      });
    }
  }

  private preRender(): void {
    this.preRenderBG();
    this.scene.home.renderOn(this.preRenderer.TMPctx);

    this.preRenderBoundaries();
  }

  private preRenderBoundaries(): void {
    this.boundaries.forEach((boundary) => {
      this.boundariesPreRenderer.fillRect({
        pos: boundary.pos,
        size: boundary.size,
        color: "red",
      });
    });

    this.boundariesData = this.boundariesPreRenderer.TMPctx.getImageData(
      0,
      0,
      this.boundariesPreRenderer.width,
      this.boundariesPreRenderer.height,
    ).data;
  }

  private preRenderBG(): void {
    this.grid.rows.forEach((row) => {
      row.cells.forEach((cell) => {
        this.preRenderer.fillRect({
          pos: cell.pos,
          size: cell.size,
          color: "#90c78a",
        });
      });
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

  private isBoundaryCollision(player: Player): boolean {
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

    const isCollision = this.isBoundaryCollision(player);
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
        player,
      );
    });

    if (!boundary) return;

    const { Left, Right, Top, Bottom } = Direction;

    switch (camera.direction) {
      case Left: {
        const x = player.pos.x - (boundary.offset.x + boundary.size.width);
        camera.setPos({
          ...camera.pos,
          x,
        });

        break;
      }

      case Right: {
        const x = player.pos.x + player.size.width - boundary.offset.x;
        camera.setPos({
          ...camera.pos,
          x,
        });

        break;
      }

      case Top: {
        const y = player.pos.y - (boundary.offset.y + boundary.size.height);
        camera.setPos({
          ...camera.pos,
          y,
        });

        break;
      }

      case Bottom: {
        const y = player.pos.y + player.size.height - boundary.offset.y;
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
    this.renderBoundaries();
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
