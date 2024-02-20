import { Scene } from "../../modules";
import { TestEntity } from "./entities/TestEntity";
import { Ground } from "./entities/Ground";
import { Mansion } from "./entities/Mansion";

export class TestScene extends Scene {
  private square = new TestEntity(this);
  private ground = new Ground(this);
  private mansion = new Mansion(this);

  protected update(): void {
    this.square.update();
  }

  protected render(): void {
    this.ground.render();
    this.mansion.render();
    this.square.render();
  }
}
