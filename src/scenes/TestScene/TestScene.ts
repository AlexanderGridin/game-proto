import { Scene } from "../../modules";
import { Player } from "./entities/Player";
import { Map } from "./entities/Map";
import { Home } from "./entities/Home";
import { MousePointer } from "./entities/MousePointer";
import { Grid } from "./entities/Grid";

export class TestScene extends Scene {
  public player = new Player(this);
  public home = new Home(this);
  public cursor = new MousePointer(this);
  public grid = new Grid(this);

  private map = new Map(this);

  protected update(): void {
    this.grid.update();
    this.map.update();
    this.player.update();
    this.cursor.update();
  }

  protected render(): void {
    this.map.render();
    this.player.render();
    this.grid.render();
    this.cursor.render();
  }
}
