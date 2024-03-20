import { Collider } from "../../../modules";
import { throwCoinWithProbability } from "../../../utils";
import { GameItem, GameItemConfig, GameItemType } from "./GameItem";

export class Bush extends GameItem {
  public type: GameItemType = GameItemType.Bush;
  public collider = new Collider<Bush>(this);
  public withBerries = false;

  constructor(config: GameItemConfig) {
    super(config);

    this.withBerries = throwCoinWithProbability(70);
    this.initCollider();
  }

  private initCollider(): void {
    this.collider.setRelativePos(1, 2);

    this.collider.size = {
      width: this.size.width - 4,
      height: this.size.height - 5,
    };
  }
}
