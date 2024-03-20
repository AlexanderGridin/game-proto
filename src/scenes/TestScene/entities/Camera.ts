import { GameObject } from "../../../modules";
import { globalState } from "../../../state";
import { Position, PositionData, Size } from "../../../types";

export enum Direction {
  Top = "top",
  Right = "right",
  Bottom = "bottom",
  Left = "left",
}

export class Camera {
  public size: Size;
  public pos: Position = new Position();

  public gameObjectToFollow: GameObject | null = null;
  public gameObjectToFollowPrevPos: PositionData | null = null;

  constructor() {
    const viewportSize = globalState.get("gameViewportSize");
    this.size = viewportSize;
  }

  public get offset(): PositionData {
    return {
      x: -this.pos.x,
      y: -this.pos.y,
    };
  }

  public get center(): PositionData {
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
    this.gameObjectToFollowPrevPos = object.pos.getData();
  }

  private moveFollowingObjectToCenter(object: GameObject): void {
    const x = Math.floor(this.size.width / 2 - object.size.width / 2);
    const y = Math.floor(this.size.height / 2 - object.size.height / 2);

    object.pos.set(x, y);
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

    const cameraX = this.pos.x + xOffset;
    const cameraY = this.pos.y + yOffset;
    this.pos.set(cameraX, cameraY);

    const x = this.gameObjectToFollowPrevPos
      ? this.gameObjectToFollowPrevPos.x
      : objectToFollow.pos.x;

    const y = this.gameObjectToFollowPrevPos
      ? this.gameObjectToFollowPrevPos.y
      : objectToFollow.pos.y;

    objectToFollow.pos.set(x, y);
    this.gameObjectToFollowPrevPos = objectToFollow.pos.getData();
  }
}
