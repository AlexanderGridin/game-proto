import { Renderer } from "./Renderer";
import { GameLoop } from "./GameLoop";
import { Mouse } from "./Mouse";
import { Keyboard } from "./Keyboard";

export abstract class Scene {
  private gameLoop: GameLoop;

  public renderer: Renderer;
  public mouse = Mouse;
  public keyboard = Keyboard;

  constructor(renderer: Renderer) {
    this.renderer = renderer;
    this.gameLoop = new GameLoop();

    this.gameLoop.onFrameRequest(() => {
      this._update();
      this._render();
    });
  }

  private _update(): void {
    this.update();
  }

  private _render(): void {
    this.renderer.clear();
    this.render();
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
