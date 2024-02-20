import { Scene } from "./Scene";

export type GameObjectConfig = {
  scene: Scene;
  imgAssetId: string;
};

export abstract class GameObject {
  protected scene: Scene;
  protected imgAsset: HTMLImageElement;

  constructor({ scene, imgAssetId }: GameObjectConfig) {
    this.scene = scene;

    if (!imgAssetId)
      throw new Error("Image asset id cannot be an empty string!");

    const asset = document.getElementById(imgAssetId);
    if (!asset) {
      throw new Error(`Unable to find image asset with id ${imgAssetId}`);
    }

    this.imgAsset = asset as HTMLImageElement;
  }

  public abstract update(): void;
  public abstract render(): void;
}
