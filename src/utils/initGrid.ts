import { GridRow, Size } from "../types";

type InitGridConfig = {
  size: Size;
  cellSize: number;
};

export const initGrid = ({ size, cellSize }: InitGridConfig): GridRow[] => {
  const { width, height } = size;
  const cols = width / cellSize;
  const rows = height / cellSize;

  const result: GridRow[] = [];
  let index = 0;

  for (let r = 0; r < rows; r++) {
    const vStart = r * cellSize;

    result.push({
      vStart,
      vEnd: vStart + cellSize,
      cells: [],
    });

    for (let c = 0; c < cols; c++) {
      const row = result[r];
      row.cells.push({
        pos: {
          x: c * cellSize,
          y: row.vStart,
        },
        size: {
          width: cellSize,
          height: cellSize,
        },
        index: index++,
        rowIndex: r,
      });
    }
  }

  return result;
};
