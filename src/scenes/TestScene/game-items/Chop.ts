import { Collider, GameItem, GameItemConfig, GameItemType } from "./GameItem";

export class Chop extends GameItem {
  public type: GameItemType = GameItemType.Chop;
  public collider: Collider = {
    ...new Collider(),
    parentId: this.id,
  };

  constructor(config: GameItemConfig) {
    super(config);
    this.initCollider();
  }

  private initCollider(): void {
    this.collider.relativePos = {
      x: 11,
      y: 8,
    };

    this.collider.size = {
      width: 12,
      height: 16,
    };

    this.initColliderPos();
  }
}
