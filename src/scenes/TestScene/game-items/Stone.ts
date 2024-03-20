import { Collider } from "../../../modules";
import { GameItem, GameItemConfig, GameItemType } from "./GameItem";

export class Stone extends GameItem {
  public type: GameItemType = GameItemType.Stone;
  public collider = new Collider<Stone>(this);

  constructor(config: GameItemConfig) {
    super(config);
    this.initCollider();
  }

  private initCollider(): void {
    this.collider.setRelativePos(2, 5);

    this.collider.size = {
      width: this.size.width - 4,
      height: this.size.height - 13,
    };
  }
}
