import { Scene } from "../../modules";
import { Player } from "./entities/Player";
import { GameMap } from "./entities/Map";
import { MousePointer } from "./entities/MousePointer";

export class TestScene extends Scene {
  public cursor = new MousePointer(this);
  public map = new GameMap(this);
  public player = new Player(this);

  protected update(): void {
    // NOTE: player needs to be updated before the map because in the map collision detecion is taked place
    // TODO: update this, so the order needs to be not important
    this.player.update();
    this.map.update();
    this.cursor.update();
  }

  protected render(): void {
    this.map.render();
    this.player.render();
    this.cursor.render();
  }
}
