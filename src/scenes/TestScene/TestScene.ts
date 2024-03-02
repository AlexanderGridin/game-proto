import { Scene } from "../../modules";
import { Player } from "./entities/Player";
import { GameMap } from "./entities/Map";
// import { MousePointer } from "./entities/MousePointer";
import { Camera } from "./entities/Camera";

export class TestScene extends Scene {
  public camera = new Camera();
  // public cursor = new MousePointer(this);
  public map = new GameMap(this);
  public player = new Player(this);

  protected update(): void {
    this.camera.update();
    this.map.update();
    this.player.update();
    // this.cursor.update();
  }

  protected render(): void {
    this.map.render();
    this.player.render();
    // this.cursor.render();
  }
}
