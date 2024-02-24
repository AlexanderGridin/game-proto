import { Scene } from "../../modules";
import { Player } from "./entities/Player";
import { Map } from "./entities/Map";
import { Home } from "./entities/Home";

export class TestScene extends Scene {
  public player = new Player(this);
  public home = new Home(this);

  private map = new Map(this);

  protected update(): void {
    this.player.update();
  }

  protected render(): void {
    this.map.render();
    this.player.render();
  }
}
