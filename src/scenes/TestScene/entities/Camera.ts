import { GameObject } from "../../../modules";
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
  public speed = 2;

  public gameObjectToFollow: GameObject | null = null;
  public gameObjectToFollowPrevPos: Position | null = null;

  constructor() {
    const viewportSize = globalState.get("gameViewportSize");
    this.size = viewportSize;
  }

  public get offset(): Position {
    return {
      x: -this.pos.x,
      y: -this.pos.y,
    };
  }

  public get center(): Position {
    return {
      x: this.size.width / 2,
      y: this.size.height / 2,
    };
  }

  public isFolowing(gameObject: GameObject): boolean {
    return this.gameObjectToFollow === gameObject;
  }

  public follow(object: GameObject): void {
    this.gameObjectToFollow = object;
    this.moveFollowingObjectToCenter(object);
    this.gameObjectToFollowPrevPos = { ...object.pos };
  }

  private moveFollowingObjectToCenter(object: GameObject): void {
    object.pos = {
      x: Math.floor(this.size.width / 2 - object.size.width / 2),
      y: Math.floor(this.size.height / 2 - object.size.height / 2),
    };
  }

  public update(): void {
    this.handleGameObjectFollowing();
  }

  private handleGameObjectFollowing(): void {
    const objectToFollow = this.gameObjectToFollow;
    const objectToFollowPrevPos = this.gameObjectToFollowPrevPos;

    if (!objectToFollow || !objectToFollowPrevPos) return;

    const xOffset = objectToFollow.pos.x - objectToFollowPrevPos.x;
    const yOffset = objectToFollow.pos.y - objectToFollowPrevPos.y;

    this.pos.x += xOffset;
    this.pos.y += yOffset;

    // TODO: update to correct types
    (objectToFollow as any).updatePos(
      (objectToFollow.pos = this.gameObjectToFollowPrevPos
        ? this.gameObjectToFollowPrevPos
        : objectToFollow.pos),
    );

    this.gameObjectToFollowPrevPos = { ...objectToFollow.pos };
  }

  public setPos(pos: Position): void {
    this.pos = pos;
  }
}
