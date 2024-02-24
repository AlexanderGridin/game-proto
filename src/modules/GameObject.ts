import { Scene } from "./Scene";

export type GameObjectConfig<SceneType> = {
  scene: SceneType;
  imgAssetId?: string;
};

export abstract class GameObject<SceneType = Scene> {
  protected scene: SceneType;
  protected imgAsset: HTMLImageElement | null = null;

  constructor({ scene, imgAssetId }: GameObjectConfig<SceneType>) {
    this.scene = scene;

    if (!imgAssetId) {
      console.warn("Image asset id is not provided");
      return;
    }

    const asset = document.getElementById(imgAssetId);
    if (!asset) {
      throw new Error(`Unable to find image asset with id ${imgAssetId}`);
    }

    this.imgAsset = asset as HTMLImageElement;
  }

  public abstract update(): void;
  public abstract render(): void;
}
