import { Renderer } from "./Renderer";
import { GameLoop } from "./GameLoop";

export abstract class Scene {
  private gameLoop: GameLoop;
  public renderer: Renderer;

  constructor(renderer: Renderer) {
    this.renderer = renderer;
    this.gameLoop = new GameLoop();

    this.gameLoop.onFrameRequest(() => {
      this.update();
      this.renderer.clear();
      this.render();
    });
  }

  public start(): void {
    this.gameLoop.start();
  }

  public stop(): void {
    this.gameLoop.stop();
  }

  protected abstract update(): void;
  protected abstract render(): void;
}
