import { Collider, GameItem, GameItemConfig, GameItemType } from "./GameItem";

export class Bush extends GameItem {
  public type: GameItemType = GameItemType.Bush;
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
      x: 1,
      y: 2,
    };

    this.collider.size = {
      width: this.size.width - 4,
      height: this.size.height - 5,
    };

    this.initColliderPos();
  }
}
