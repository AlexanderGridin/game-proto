import { globalState } from "../../state";
import { Position } from "../../types";

export class _Mouse {
  private canvas: HTMLCanvasElement;
  public pos: Position = { x: 0, y: 0 };

  private listeners: (() => void)[] = [];

  constructor() {
    const canvas = document.querySelector<HTMLCanvasElement>("#game");

    if (!canvas) {
      throw new Error("Game wrapper not found!");
    }

    const viewportSize = globalState.get("gameViewportSize");
    this.canvas = canvas;

    this.canvas.width = viewportSize.width;
    this.canvas.height = viewportSize.height;

    const rect = this.canvas.getBoundingClientRect();

    window.addEventListener("mousemove", (e) => {
      this.pos.x = e.clientX - rect.left * (canvas.width / rect.width);
      this.pos.y = e.clientY - rect.top * (canvas.height / rect.height);
    });

    window.addEventListener("click", () => {
      // console.log(e.button);
      this.listeners.forEach((listenerFn) => listenerFn());
    });
  }

  public onClick(fn: () => void): void {
    this.listeners.push(fn);
  }
}

export const Mouse = new _Mouse();
