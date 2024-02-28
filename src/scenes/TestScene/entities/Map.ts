import { TestScene } from "..";
import { GameObject, Renderer } from "../../../modules";
import { Keyboard } from "../../../modules/Keyboard";
import { KeyboardKeyCode } from "../../../modules/Keyboard/enums";
import { globalState } from "../../../state";
import { Position, Size } from "../../../types";

enum Direction {
  Top = "top",
  Right = "right",
  Bottom = "bottom",
  Left = "left",
}

export class Map extends GameObject<TestScene> {
  private preRenderer = new Renderer();
  public pos: Position = { x: 0, y: 0 };
  private boundariesPreRenderer = new Renderer();
  private boundariesData: Uint8ClampedArray | null = null;
  private boundarySize = 16;
  private direction: Direction | null = null;
  private boundaries: { pos: Position; size: Size; offset: Position }[] = [
    {
      pos: this.pos,
      size: {
        width: globalState.get("gameViewportSize").width,
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
        height: globalState.get("gameViewportSize").height,
      },
      offset: {
        x: 0,
        y: 0,
      },
    },
    {
      pos: {
        ...this.pos,
        x:
          this.pos.x +
          globalState.get("gameViewportSize").width -
          this.boundarySize,
      },
      size: {
        width: this.boundarySize,
        height: globalState.get("gameViewportSize").height,
      },
      offset: {
        x: globalState.get("gameViewportSize").width - this.boundarySize,
        y: 0,
      },
    },
    {
      pos: {
        ...this.pos,
        y:
          this.pos.y +
          globalState.get("gameViewportSize").height -
          this.boundarySize,
      },
      size: {
        width: globalState.get("gameViewportSize").width,
        height: this.boundarySize,
      },
      offset: {
        x: 0,
        y: globalState.get("gameViewportSize").height - this.boundarySize,
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

    this.preRender();
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
    const gridRows = globalState.get("gridRows");

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

  public update(): void {
    this.move();
    this.checkCollisionWithPlayer();
  }

  private getBoundariesData(pos: Position) {
    if (!this.boundariesData) return;

    const { x, y } = pos;
    const r =
      this.boundariesData[
        (this.scene.renderer.width * (y - this.pos.y) + (x - this.pos.x)) * 4
      ];

    return r === 255;
  }

  private move(): void {
    if (Keyboard.isKeyPressed(KeyboardKeyCode.S)) {
      this.direction = Direction.Bottom;
      this.pos.y -= this.scene.player.velocity;
      return;
    }

    if (Keyboard.isKeyPressed(KeyboardKeyCode.W)) {
      this.direction = Direction.Top;
      this.pos.y += this.scene.player.velocity;
      return;
    }

    if (Keyboard.isKeyPressed(KeyboardKeyCode.A)) {
      this.direction = Direction.Left;
      this.pos.x += this.scene.player.velocity;
      return;
    }

    if (Keyboard.isKeyPressed(KeyboardKeyCode.D)) {
      this.direction = Direction.Right;
      this.pos.x -= this.scene.player.velocity;
      return;
    }

    this.direction = null;
  }

  private rectCollision(a: any, b: any): boolean {
    return (
      a.pos.x < b.pos.x + b.size.width &&
      a.pos.x + a.size.width > b.pos.x &&
      a.pos.y < b.pos.y + b.size.height &&
      a.pos.y + a.size.height > b.pos.y
    );
  }

  private checkCollisionWithPlayer(): void {
    const player = this.scene.player;

    const isTopLeftCollision = this.getBoundariesData(player.pos);
    const isBootomLeftCollision = this.getBoundariesData({
      x: player.pos.x,
      y: player.pos.y + player.size.height,
    });
    const isTopRightCollision = this.getBoundariesData({
      x: player.pos.x + player.size.width,
      y: player.pos.y,
    });
    const isBottomRightCollision = this.getBoundariesData({
      x: player.pos.x + player.size.width,
      y: player.pos.y + player.size.height,
    });

    if (
      !isTopLeftCollision &&
      !isBottomRightCollision &&
      !isTopRightCollision &&
      !isBootomLeftCollision
    )
      return;

    const boundary = this.boundaries.find((boundary) => {
      return this.rectCollision(
        {
          pos: {
            x: this.pos.x + boundary.offset.x,
            y: this.pos.y + boundary.offset.y,
          },
          size: boundary.size,
        },
        player,
      );
    });

    if (!boundary) return;

    const { Left: West, Right: East, Top: North, Bottom: South } = Direction;

    switch (this.direction) {
      case West:
        this.pos.x = player.pos.x - (boundary.offset.x + boundary.size.width);
        break;

      case East:
        this.pos.x = player.pos.x + player.size.width - boundary.offset.x;
        break;

      case North:
        this.pos.y = player.pos.y - (boundary.offset.y + boundary.size.height);
        break;

      case South:
        this.pos.y = player.pos.y + player.size.height - boundary.offset.y;
        break;
    }
  }

  public render(): void {
    this.scene.renderer.drawImg({
      img: this.preRenderer.canvas,
      pos: this.pos,
    });

    this.scene.renderer.drawImg({
      img: this.boundariesPreRenderer.canvas,
      pos: this.pos,
    });
  }
}
