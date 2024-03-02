import { GameObject } from "../../../modules";
import { Keyboard } from "../../../modules/Keyboard";
import { KeyboardKeyCode } from "../../../modules/Keyboard/enums";
import { Position, Size } from "../../../types";
import { TestScene } from "../TestScene";

export class Player extends GameObject<TestScene> {
  public pos: Position;
  public collider: { pos: Position; size: Size } = {
    pos: new Position(),
    size: {
      width: 8,
      height: 8,
    },
  };
  private isRenderCollider = false;
  private hoveredObject: any | null = null;

  public size: Size = {
    width: 16,
    height: 32,
  };

  constructor(scene: TestScene) {
    super({ scene, imgAssetId: "player2" });

    const camera = this.scene.camera;
    this.pos = {
      x: Math.floor(camera.size.width / 2 - this.size.width / 2),
      y: Math.floor(camera.size.height / 2 - this.size.height / 2),
    };
    this.collider.pos = {
      x: this.pos.x + (this.size.width - this.collider.size.width) / 2,
      y: this.pos.y + this.size.height - this.collider.size.height,
    };
  }

  public update(): void {
    if (Keyboard.isKeyClicked(KeyboardKeyCode.I)) {
      this.isRenderCollider = !this.isRenderCollider;
    }

    if (Keyboard.isKeyClicked(KeyboardKeyCode.J)) {
      if (this.hoveredObject) {
        this.scene.map.removeItem(this.hoveredObject);
        this.hoveredObject = null;
      }
    }
  }

  public setHoveredObject(obj: any): void {
    this.hoveredObject = obj;
    console.log(this.hoveredObject);
  }

  public render(): void {
    // this.scene.renderer.TMPctx.fillStyle = "black";
    // this.scene.renderer.TMPctx.fillText(
    //   `x: ${this.pos.x - this.scene.camera.pos.x}; y: ${this.pos.y - this.scene.camera.pos.y}`,
    //   this.pos.x,
    //   this.pos.y - 12,
    // );
    //
    if (this.imgAsset) {
      this.scene.renderer.drawImg({
        img: this.imgAsset,
        pos: this.pos,
      });
    }

    if (this.isRenderCollider) {
      this.scene.renderer.fillRect({
        pos: this.collider.pos,
        size: this.collider.size,
        color: "red",
      });
    }
  }
}
