export type PositionData = {
  x: number;
  y: number;
};

type Listener = (data: PositionData) => void;

export class Position {
  public x = 0;
  public y = 0;

  private listeners: Listener[] = [];

  public set(x: number, y: number): void {
    this.x = x;
    this.y = y;

    this.notifyListeners();
  }

  public setX(x: number): void {
    this.x = x;
    this.notifyListeners();
  }

  public setY(y: number): void {
    this.y = y;
    this.notifyListeners();
  }

  public getData(): PositionData {
    return {
      x: this.x,
      y: this.y,
    };
  }

  public onChange(listener: Listener): void {
    this.listeners.push(listener);
  }

  public detachOnChange(listener: Listener): void {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  private notifyListeners(): void {
    if (!this.listeners.length) return;

    for (let listener of this.listeners) {
      listener({ x: this.x, y: this.y });
    }
  }
}
