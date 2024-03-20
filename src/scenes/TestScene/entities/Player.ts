import {
  Collider,
  GameObject,
  SpriteSheet,
  SpriteSheetFrameData,
} from "../../../modules";
import { Keyboard } from "../../../modules/Keyboard";
import { KeyboardKeyCode } from "../../../modules/Keyboard/enums";
import { Position, Size } from "../../../types";
import { UI } from "../../../ui";
import { TestScene } from "../TestScene";
import { isBush } from "../game-items";
import { GameItem } from "../game-items/GameItem";
import { Direction } from "./Camera";

export class Player extends GameObject<TestScene> {
  private spriteSheet = new SpriteSheet({
    imgSelector: "#player2",
    frameSize: { width: 32, height: 32 },
  });
  private spriteSheetFrame: SpriteSheetFrameData | null = null;
  public pos: Position = new Position();
  public size: Size = {
    width: 32,
    height: 32,
  };

  public direction: Direction | null = null;
  public speed = 2;

  public collider = new Collider(this);

  private isRenderCollider = false;
  private hoveredItem: GameItem | null = null;

  constructor(scene: TestScene) {
    super({ scene });

    this.spriteSheetFrame = this.spriteSheet.getFrame(1, 1);

    this.collider.size = {
      width: 10,
      height: 12,
    };

    this.pos.onChange(() => {
      this.updateColliderPos();
    });

    this.scene.camera.follow(this);
  }

  private updateColliderPos(): void {
    const xOffset = this.size.width - this.collider.size.width;
    const yOffset = this.size.height - this.collider.size.height;

    const x = this.pos.x + xOffset / 2;
    const y = this.pos.y + yOffset;
    this.collider.pos.set(x, y);
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
      this.pos.setY(this.pos.y + speed);
      this.spriteSheetFrame = this.spriteSheet.getFrame(1, 1);

      return;
    }

    if (Keyboard.isKeyPressed(KeyboardKeyCode.W)) {
      this.direction = Direction.Top;
      this.spriteSheetFrame = this.spriteSheet.getFrame(1, 3);
      this.pos.setY(this.pos.y - speed);

      return;
    }

    if (Keyboard.isKeyPressed(KeyboardKeyCode.A)) {
      this.direction = Direction.Left;
      this.spriteSheetFrame = this.spriteSheet.getFrame(1, 4);
      this.pos.setX(this.pos.x - speed);

      return;
    }

    if (Keyboard.isKeyPressed(KeyboardKeyCode.D)) {
      this.direction = Direction.Right;
      this.spriteSheetFrame = this.spriteSheet.getFrame(1, 2);
      this.pos.setX(this.pos.x + speed);

      return;
    }

    this.direction = null;
  }

  private toggleColliderRendering(): void {
    this.isRenderCollider = !this.isRenderCollider;
  }

  private handlePickItem(): void {
    if (!this.hoveredItem) return;

    if (isBush(this.hoveredItem)) {
      if (!this.hoveredItem.withBerries) return;

      this.hoveredItem.pickBerries();
      UI.notifications.push(`Picked item: ${this.hoveredItem.type} berries`);
      this.hoveredItem = null;
      this.scene.map.renderItems();

      return;
    }

    this.scene.map.removeItem(this.hoveredItem);
    UI.notifications.push(`Picked item: ${this.hoveredItem.type}`);
    this.hoveredItem = null;
  }

  public setHoveredItem(item: GameItem | null): void {
    this.hoveredItem = item;
  }

  public render(): void {
    this.drawPosText();

    if (this.spriteSheetFrame) {
      this.scene.renderer.drawSpriteSheetFrame(this.spriteSheetFrame, this);
    }

    this.drawCollider();
  }

  private drawCollider(): void {
    if (!this.isRenderCollider) return;

    const color = "red";

    this.scene.renderer.fillRect({
      pos: this.collider.pos,
      size: this.collider.size,
      color,
    });

    this.scene.renderer.strokeRect({
      pos: this.pos.getData(),
      size: this.size,
      color,
    });
  }

  private drawPosText(): void {
    this.scene.renderer.TMPctx.fillStyle = "white";
    this.scene.renderer.TMPctx.fillText(
      `x: ${this.pos.x - this.scene.camera.offset.x}; y: ${this.pos.y - this.scene.camera.offset.y}`,
      this.pos.x - 22,
      this.pos.y - 5,
    );
  }
}
