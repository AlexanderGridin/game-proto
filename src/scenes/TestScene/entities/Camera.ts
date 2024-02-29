import { Keyboard } from "../../../modules/Keyboard";
import { KeyboardKeyCode } from "../../../modules/Keyboard/enums";
import { globalState } from "../../../state";
import { Position, Size } from "../../../types";

export enum Direction {
  Top = "top",
  Right = "right",
  Bottom = "bottom",
  Left = "left",
}

export class Camera {
  public size: Size;
  public pos: Position = new Position();
  public speed = 5;
  public direction: Direction | null = null;

  constructor() {
    const viewportSize = globalState.get("gameViewportSize");
    this.size = viewportSize;
    // this.pos.x = -700;
    // this.pos.y = -800;
  }

  public update(): void {
    this.move();
  }

  private move(): void {
    if (Keyboard.isKeyPressed(KeyboardKeyCode.S)) {
      this.direction = Direction.Bottom;
      this.pos.y -= this.speed;
      return;
    }

    if (Keyboard.isKeyPressed(KeyboardKeyCode.W)) {
      this.direction = Direction.Top;
      this.pos.y += this.speed;
      return;
    }

    if (Keyboard.isKeyPressed(KeyboardKeyCode.A)) {
      this.direction = Direction.Left;
      this.pos.x += this.speed;
      return;
    }

    if (Keyboard.isKeyPressed(KeyboardKeyCode.D)) {
      this.direction = Direction.Right;
      this.pos.x -= this.speed;
      return;
    }

    this.direction = null;
  }

  public setPos(pos: Position): void {
    this.pos = pos;
  }
}
