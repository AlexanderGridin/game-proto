import { Collider, GameItem, GameItemConfig, GameItemType } from "./GameItem";

export class Stone extends GameItem {
  public type: GameItemType = GameItemType.Stone;
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
      x: 2,
      y: 5,
    };

    this.collider.size = {
      width: this.size.width - 4,
      height: this.size.height - 13,
    };

    this.initColliderPos();
  }
}
