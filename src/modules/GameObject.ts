import { Position, Size } from "../types";
import { Scene } from "./Scene";

export type GameObjectConfig<SceneType> = {
  scene: SceneType;
};

export abstract class GameObject<SceneType = Scene> {
  protected scene: SceneType;

  public abstract pos: Position;
  public abstract size: Size;

  constructor({ scene }: GameObjectConfig<SceneType>) {
    this.scene = scene;
  }

  public abstract update(): void;
  public abstract render(): void;
}
