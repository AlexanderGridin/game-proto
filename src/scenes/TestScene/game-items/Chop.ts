import { Collider } from "../../../modules";
import { throwCoinWithProbability } from "../../../utils";
import { GameItem, GameItemConfig, GameItemType } from "./GameItem";

export class Chop extends GameItem {
  public type: GameItemType = GameItemType.Chop;
  public collider = new Collider<Chop>(this);
  public withBerries = false;

  constructor(config: GameItemConfig) {
    super(config);

    this.withBerries = throwCoinWithProbability(70);
    this.initCollider();
  }

  private initCollider(): void {
    this.collider.setRelativePos(11, 8);

    this.collider.size = {
      width: 12,
      height: 16,
    };
  }
}
