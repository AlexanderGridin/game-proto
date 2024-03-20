import { Collider } from "../../../modules";
import { throwCoinWithProbability } from "../../../utils";
import { GameItem, GameItemConfig, GameItemType } from "./GameItem";

const BERRIES_RESTORE_TIME = 5 * 1000;

type BerriesListener = () => void;

export class Bush extends GameItem {
  public type: GameItemType = GameItemType.Bush;
  public collider = new Collider<Bush>(this);
  public withBerries = false;

  public berriesListeners: BerriesListener[] = [];

  constructor(config: GameItemConfig) {
    super(config);

    this.withBerries = throwCoinWithProbability(80);
    this.initCollider();
  }

  private initCollider(): void {
    this.collider.setRelativePos(1, 2);

    this.collider.size = {
      width: this.size.width - 4,
      height: this.size.height - 5,
    };
  }

  public pickBerries(): void {
    if (!this.withBerries) return;

    this.toggleBerries();

    setTimeout(() => {
      this.toggleBerries();
      this.notifyBerriesListeners();
    }, BERRIES_RESTORE_TIME);
  }

  private toggleBerries(): void {
    this.withBerries = !this.withBerries;
  }

  public onBerriesReady(listener: BerriesListener): void {
    this.berriesListeners.push(listener);
  }

  private notifyBerriesListeners(): void {
    for (let listener of this.berriesListeners) {
      listener();
    }
  }
}
