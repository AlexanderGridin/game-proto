import { TestScene } from "..";
import { GameObject, Renderer } from "../../../modules";
import { Keyboard } from "../../../modules/Keyboard";
import { KeyboardKeyCode } from "../../../modules/Keyboard/enums";
import { globalState } from "../../../state";
import { Position } from "../../../types";

export class Map extends GameObject<TestScene> {
  private preRenderer = new Renderer();
  public pos: Position = { x: 0, y: 0 };

  constructor(scene: TestScene) {
    super({ scene, imgAssetId: "grass-tile" });

    this.preRender();
  }

  private preRender(): void {
    this.preRenderBG();
    this.scene.home.renderOn(this.preRenderer.TMPctx);
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

  private move(): void {
    if (Keyboard.isKeyPressed(KeyboardKeyCode.S)) {
      this.pos.y -= this.scene.player.velocity;
      return;
    }

    if (Keyboard.isKeyPressed(KeyboardKeyCode.W)) {
      this.pos.y += this.scene.player.velocity;
      return;
    }

    if (Keyboard.isKeyPressed(KeyboardKeyCode.A)) {
      this.pos.x += this.scene.player.velocity;
      return;
    }

    if (Keyboard.isKeyPressed(KeyboardKeyCode.D)) {
      this.pos.x -= this.scene.player.velocity;
      return;
    }
  }

  private checkCollisionWithPlayer(): void {
    const player = this.scene.player;
    const gridRows = globalState.get("gridRows");
    const cellSize = globalState.get("cellSize");

    const isLeftCollision = this.pos.x >= player.pos.x;
    if (isLeftCollision) {
      this.pos.x = player.pos.x;
    }

    const isTopCollision = this.pos.y >= player.pos.y;
    if (isTopCollision) {
      this.pos.y = player.pos.y;
    }

    const mapWidth = gridRows[0].cells.length * cellSize;
    const mapRight = this.pos.x + mapWidth;
    const playerRight = player.pos.x + player.size.width;
    const isRightCollision = mapRight < playerRight;

    if (isRightCollision) {
      this.pos.x = playerRight - gridRows[0].cells.length * cellSize;
    }

    const mapHeight = gridRows.length * cellSize;
    const mapBottom = this.pos.y + mapHeight;
    const playerBottom = player.pos.y + player.size.height;
    const isBottomCollision = mapBottom < playerBottom;

    if (isBottomCollision) {
      this.pos.y = playerBottom - mapHeight;
    }
  }

  public render(): void {
    this.scene.renderer.drawImg({
      img: this.preRenderer.canvas,
      pos: this.pos,
    });
  }
}
