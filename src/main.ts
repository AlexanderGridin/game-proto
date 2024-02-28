import { Renderer, Scene } from "./modules";
import { TestScene } from "./scenes/TestScene";
import { globalState } from "./state";
import { handleLoader, initGrid } from "./utils";

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

window.addEventListener("load", () => {
  handleLoader();

  const v = globalState.get("gameViewportSize");
  const gridRows = initGrid({
    gridSize: {
      width: v.width,
      height: v.height,
    },
    cellSize: globalState.get("cellSize"),
  });

  globalState.set("gridRows", gridRows);

  const c = document.getElementById("game");
  if (c) {
    (c as HTMLCanvasElement).width = v.width;
    (c as HTMLCanvasElement).height = v.height;
  }

  const mainRenderer = new Renderer("#game");
  const testScene = new TestScene(mainRenderer);
  testScene.start();

  setupDevButtons(testScene);
});
