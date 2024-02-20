import { Renderer } from "../modules";
import { GridRow } from "../types";

export const drawGrid = (renderer: Renderer, gridRows: GridRow[]): void => {
  const lineWidth = 0.5;
  const color = "#5E81AC";

  gridRows.forEach((row) => {
    const rowY = row.vStart - 0.5;

    renderer.drawLine({
      start: {
        x: 0,
        y: rowY,
      },
      end: {
        x: renderer.width,
        y: rowY,
      },
      lineWidth,
      color,
    });
  });

  gridRows[0].cells.forEach((cell) => {
    const cellX = cell.pos.x - 0.5;

    renderer.drawLine({
      start: { x: cellX, y: 0 },
      end: { x: cellX, y: renderer.height },
      lineWidth,
      color,
    });
  });
};
