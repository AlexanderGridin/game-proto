import { Renderer, Scene, State } from "./modules";
import { TestScene } from "./scenes/TestScene";
import { drawGrid, handleLoader, initGrid } from "./utils";

const handleGrid = () => {
  const gridRenderer = new Renderer("#front");
  const gridRows = initGrid({
    gridSize: {
      width: gridRenderer.width,
      height: gridRenderer.height,
    },
    cellSize: State.getCellSize(),
  });

  State.setGridRows(gridRows);
  // console.log(gridRows.length, gridRows[0].cells.length);
  drawGrid(gridRenderer, gridRows);
};

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

const setupKeyboardHandler = () => {
  window.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowRight":
        console.log("Right");
        break;

      case "ArrowLeft":
        console.log("Left");
        break;

      case "ArrowUp":
        console.log("Up");
        break;

      case "ArrowDown":
        console.log("Down");
        break;
    }
  });
};

window.addEventListener("load", () => {
  handleLoader();
  handleGrid();

  const mainRenderer = new Renderer("#middle");
  const testScene = new TestScene(mainRenderer);

  setupDevButtons(testScene);
  setupKeyboardHandler();
});
