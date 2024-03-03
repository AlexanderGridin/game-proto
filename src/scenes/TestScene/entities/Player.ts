import { GameObject } from "../../../modules";
import { Keyboard } from "../../../modules/Keyboard";
import { KeyboardKeyCode } from "../../../modules/Keyboard/enums";
import { Position, Size } from "../../../types";
import { UI } from "../../../ui";
import { TestScene } from "../TestScene";
import { Collider, GameItem } from "../game-items/GameItem";
import { Direction } from "./Camera";

export class Player extends GameObject<TestScene> {
  public pos: Position = new Position();
  public size: Size = {
    width: 16,
    height: 32,
  };

  public direction: Direction | null = null;
  public speed = 2;

  public collider: Collider = {
    pos: new Position(),
    size: {
      width: 8,
      height: 8,
    },
    relativePos: new Position(),
    parentId: "player",
  };

  private isRenderCollider = false;
  private hoveredItem: GameItem | null = null;

  constructor(scene: TestScene) {
    super({ scene, imgAssetId: "player2" });

    this.scene.camera.follow(this);
    this.updateColliderPos();
  }

  public updatePos(pos: Position): void {
    this.pos = {
      ...pos,
    };

    this.updateColliderPos();
  }

  private updateColliderPos(): void {
    const xOffset = this.size.width - this.collider.size.width;
    const yOffset = this.size.height - this.collider.size.height;

    this.collider.pos = {
      x: this.pos.x + xOffset / 2,
      y: this.pos.y + yOffset,
    };
  }

  public update(): void {
    if (Keyboard.isKeyClicked(KeyboardKeyCode.I)) {
      this.toggleColliderRendering();
    }

    if (Keyboard.isKeyClicked(KeyboardKeyCode.J)) {
      this.handlePickItem();
    }

    this.handleMove();
  }

  private handleMove(): void {
    let speed = this.speed;

    if (Keyboard.isKeyPressed(KeyboardKeyCode.SHIFT)) {
      speed *= speed;
    }

    this.move(speed);
  }

  private move(speed: number): void {
    if (Keyboard.isKeyPressed(KeyboardKeyCode.S)) {
      this.direction = Direction.Bottom;
      this.pos.y += speed;
      this.updateColliderPos();
      return;
    }

    if (Keyboard.isKeyPressed(KeyboardKeyCode.W)) {
      this.direction = Direction.Top;
      this.pos.y -= speed;
      this.updateColliderPos();
      return;
    }

    if (Keyboard.isKeyPressed(KeyboardKeyCode.A)) {
      this.direction = Direction.Left;
      this.pos.x -= speed;
      this.updateColliderPos();
      return;
    }

    if (Keyboard.isKeyPressed(KeyboardKeyCode.D)) {
      this.direction = Direction.Right;
      this.pos.x += speed;
      this.updateColliderPos();
      return;
    }

    this.direction = null;
  }

  private toggleColliderRendering(): void {
    this.isRenderCollider = !this.isRenderCollider;
  }

  private handlePickItem(): void {
    if (!this.hoveredItem) return;

    this.scene.map.removeItem(this.hoveredItem);
    UI.notifications.push(`Picked item: ${this.hoveredItem.type}`);
    this.hoveredItem = null;
  }

  public setHoveredItem(item: GameItem | null): void {
    this.hoveredItem = item;
  }

  public render(): void {
    this.scene.renderer.TMPctx.fillStyle = "black";
    this.scene.renderer.TMPctx.fillText(
      `x: ${this.pos.x - this.scene.camera.offset.x}; y: ${this.pos.y - this.scene.camera.offset.y}`,
      this.pos.x - 22,
      this.pos.y - 5,
    );

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
