import { TestScene } from "..";
import { GameObject } from "../../../modules";
import { Position, Size } from "../../../types";

export class ItemsProgress extends GameObject<TestScene> {
  public pos: Position = { x: 25, y: 25 };
  public size: Size = { width: 100, height: 30 };
  private renderWidth = this.size.width;

  private initialValue: number;
  private value: number;

  constructor(scene: TestScene, value: number) {
    super({ scene });

    this.initialValue = value;
    this.value = value;
  }

  public update(newValue?: number): void {
    this.renderWidth = Math.floor(
      ((newValue ?? this.value) / this.initialValue) * this.size.width,
    );
  }

  public render(): void {
    this.scene.renderer.fillRect({
      pos: this.pos,
      size: {
        ...this.size,
        width: this.renderWidth,
      },
      color: "red",
    });

    this.scene.renderer.strokeRect({
      pos: this.pos,
      size: this.size,
      color: "red",
    });
  }
}
