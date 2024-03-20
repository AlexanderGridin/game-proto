import { Position, PositionData, Size } from "../types";

type Parent = {
  pos: Position;
};

export class Collider<ParentType extends Parent | null = null> {
  public pos = new Position();
  private relativePos = new Position();

  public size = new Size();

  public parent: ParentType | null;

  constructor(parent?: ParentType) {
    this.parent = parent ?? null;

    this.relativePos.onChange(this.handleRelativePosChange.bind(this));
  }

  public setRelativePos(x: number, y: number): void {
    this.relativePos.set(x, y);
  }

  private handleRelativePosChange(updatedData: PositionData): void {
    if (!this.parent) return;

    const x = this.parent.pos.x + updatedData.x;
    const y = this.parent.pos.y + updatedData.y;

    this.pos.set(x, y);
  }
}
