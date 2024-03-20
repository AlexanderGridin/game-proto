import { TestScene } from "..";
import { GameObject } from "../../../modules";
import { Position, Size } from "../../../types";

export class MousePointer extends GameObject<TestScene> {
  public pos: Position = { x: 0, y: 0 };
  public size: Size = { width: 8, height: 8 };

  constructor(scene: TestScene) {
    super({ scene });
  }

  public update(): void {
    this.pos.x = this.scene.mouse.pos.x - this.size.width / 2;
    this.pos.y = this.scene.mouse.pos.y - this.size.height / 2;
  }

  public render(): void {
    this.scene.renderer.fillRect({
      pos: this.pos,
      size: this.size,
      color: "#c283ae",
    });

    this.scene.renderer.TMPctx.font = "16px Arial";
    this.scene.renderer.TMPctx.fillStyle = "white"; // Fill color
    this.scene.renderer.TMPctx.fillText(
      `x: ${this.pos.x}, y: ${this.pos.y}`,
      this.pos.x,
      this.pos.y - this.size.height * 2,
    );
  }
}
