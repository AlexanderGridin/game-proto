export class GameLoop {
  private requestId: number | null = null;
  private frameRequestCallback: (() => void) | null = null;

  private requestFrame(): void {
    if (this.frameRequestCallback) this.frameRequestCallback();
    this.requestId = requestAnimationFrame(this.requestFrame.bind(this));
  }

  public start(): void {
    if (this.requestId) {
      console.warn(
        "You already have running game loop. Please stop the current one before starting new.",
      );
      return;
    }

    console.log("start loop");
    this.requestFrame();
  }

  public stop(): void {
    if (!this.requestId) {
      console.warn("You don't have any running game loops.");
      return;
    }

    cancelAnimationFrame(this.requestId);
    this.requestId = null;
    console.log("stop loop");
  }

  public get isRunning(): boolean {
    return Boolean(this.requestId);
  }

  public onFrameRequest(callback: () => void): void {
    this.frameRequestCallback = callback;
  }
}
