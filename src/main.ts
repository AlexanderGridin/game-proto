import { Renderer, Scene } from "./modules";
import { TestScene } from "./scenes/TestScene";
import { globalState } from "./state";
import { handleLoader } from "./utils";

const setupDevButtons = (scene: Scene) => {
  document.body.addEventListener("click", (e) => {
    const target = e.target;
    const isElement = target instanceof Element;

    if (!target || !isElement) return;

    switch (target.id) {
      case "start-button":
        scene.start();
        break;

      case "stop-button":
        scene.stop();
        break;
    }
  });
};

window.addEventListener("load", async () => {
  handleLoader();

  const res = await fetch("/assets/tiles/map.json");
  const data = await res.json();
  globalState.set("mapLayers", data.layers);

  const mainRenderer = new Renderer({ canvasId: "#game" });
  const testScene = new TestScene(mainRenderer);
  testScene.start();

  setupDevButtons(testScene);
});
