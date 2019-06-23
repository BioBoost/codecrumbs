import { FILE_NODE_TYPE, DIR_NODE_TYPE } from '../../constants';

export const calculateLayoutProps = (list, padding = 100) => {
  if (!list) {
    return {
      width: 0,
      height: 0
    };
  }

  let minX = 0,
    minY = 0,
    maxX = 0,
    maxY = 0;

  let ccAlightPoint = 0;
  let maxCcWidth = 0;

  list.each(node => {
    const [x, nY] = [node.y, node.x];
    const nX = x + node.ySize;

    if (node.data.type !== FILE_NODE_TYPE && node.data.type !== DIR_NODE_TYPE) {
      if (node.ySize > maxCcWidth) {
        maxCcWidth = node.ySize;
      }

      return;
    }

    if (nX < minX) {
      minX = nX;
    }

    if (nY - node.xSize < minY) {
      minY = nY - node.xSize;
    }

    if (nX > maxX) {
      maxX = nX;
      ccAlightPoint = node.y + node.ySize;
    }

    if (nY + node.xSize > maxY) {
      maxY = nY + node.xSize;
    }
  });

  return {
    width: Math.round(Math.abs(maxX + maxCcWidth) + Math.abs(minX) + 2 * padding),
    height: Math.round(Math.abs(maxY) + Math.abs(minY) + 3 * padding),
    xShift: padding / 4,
    yShift: Math.round(Math.abs(minY)) + padding,
    ccAlightPoint
  };
};

export const buildShiftToPoint = shift => (x, y) => ({
  x: Math.round(shift.x + x),
  y: Math.round(shift.y + y)
});
