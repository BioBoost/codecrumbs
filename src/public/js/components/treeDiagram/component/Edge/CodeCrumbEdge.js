import React from 'react';
import classNames from 'classnames';

import { SYMBOL_WIDTH } from 'components/treeDiagram/component/constants';
import Arrow from 'components/treeDiagram/component/Icons/Arrow';
import './index.scss';

export const PartEdge = props => {
  const { sourcePosition, parentName } = props;

  const nameWidth = SYMBOL_WIDTH * parentName.length;
  const padding = 17;

  const P1 = { x: sourcePosition.x + nameWidth + padding, y: sourcePosition.y };
  const P2 = { x: P1.x + padding + 6, y: P1.y };

  const polylinePoints = [[P1.x, P1.y], [P2.x, P2.y]];

  return (
    <React.Fragment>
      <polyline
        points={polylinePoints.join(', ')}
        className={'CodeCrumbEdge'}
        strokeDasharray="2"
      />
      <line x1={P1.x} y1={P1.y - 2} x2={P1.x} y2={P1.y + 2} className={'CodeCrumbEdge'} />
    </React.Fragment>
  );
};

export const CodeCrumbEdge = props => {
  const { sourcePosition, targetPosition, parentName } = props;

  const nameWidth = SYMBOL_WIDTH * parentName.length;
  const padding = 40;
  const edgeTurnDistance = 20;

  const P1 = { x: sourcePosition.x + nameWidth + padding, y: sourcePosition.y };

  const P2 = { x: targetPosition.x - edgeTurnDistance, y: sourcePosition.y };
  const P3 = { x: targetPosition.x - edgeTurnDistance, y: targetPosition.y };
  const P4 = targetPosition;

  const polylinePoints = [[P1.x, P1.y], [P2.x, P2.y], [P3.x, P3.y], [P4.x, P4.y]];

  return (
    <polyline points={polylinePoints.join(', ')} className={'CodeCrumbEdge'} strokeDasharray="2" />
  );
};

export const CodeCrumbedFlowEdge = props => {
  const {
    sourcePosition,
    targetPosition,
    sourceName,
    singleCrumbSource,
    singleCrumbTarget,
    selected,
    onClick
  } = props;

  const rHalf = 6;
  const sourcePt = {
    x: -rHalf + (singleCrumbSource ? sourcePosition.x - 22 : sourcePosition.x),
    y: sourcePosition.y + rHalf
  };
  const targetPt = {
    x: -rHalf + (singleCrumbTarget ? targetPosition.x - 22 : targetPosition.x),
    y: targetPosition.y - rHalf
  };

  const padding = 21 - rHalf;
  const vTurn = 13;

  let polylinePoints = [];

  // TODO: refactor, THIS IS HELL OF A MESS
  if (targetPt.y < sourcePt.y) {
    if (targetPt.x > sourcePt.x) {
      const isWide = Math.abs(sourcePt.x - targetPt.x) > 20;
      polylinePoints = [
        [sourcePt.x, sourcePt.y],
        [sourcePt.x, sourcePt.y + padding],
        [targetPt.x + (isWide ? -12 : 12), sourcePt.y + padding],
        [targetPt.x + (isWide ? -12 : 12), targetPt.y - vTurn + 2],
        [targetPt.x, targetPt.y - vTurn + 2],
        [targetPt.x, targetPt.y]
      ];
    } else {
      const nLength = sourceName.length < 10 ? sourceName.length * SYMBOL_WIDTH + 8 : 120;
      polylinePoints = [
        [sourcePt.x, sourcePt.y],
        [sourcePt.x, sourcePt.y + padding],
        [sourcePt.x + nLength, sourcePt.y + padding],
        [sourcePt.x + nLength, targetPt.y - vTurn + 2],
        [targetPt.x, targetPt.y - vTurn + 2],
        [targetPt.x, targetPt.y]
      ];
    }
  } else {
    if (Math.abs(sourcePt.x - targetPt.x) < 5) {
      polylinePoints = [[sourcePt.x, sourcePt.y], [targetPt.x, targetPt.y]];
    } else {
      if (Math.abs(targetPt.y - sourcePt.y) > padding) {
        polylinePoints = [
          [sourcePt.x, sourcePt.y],
          [sourcePt.x, sourcePt.y + padding],
          [targetPt.x, sourcePt.y + padding],
          [targetPt.x, targetPt.y]
        ];
      } else {
        polylinePoints = [
          [sourcePt.x, sourcePt.y],
          [sourcePt.x, sourcePt.y + padding],
          [targetPt.x - 12, sourcePt.y + padding],
          [targetPt.x - 12, targetPt.y - vTurn + 2],
          [targetPt.x, targetPt.y - vTurn + 2],
          [targetPt.x, targetPt.y]
        ];
      }
    }
  }

  const iconSize = 8;
  const endPointConfig = {
    x: targetPt.x - 4,
    y: targetPt.y - iconSize
  };

  return (
    <g className={'CodeCrumbEdge'}>
      <polyline
        points={polylinePoints.join(', ')}
        className={classNames('CodeCrumbEdge-flow', {
          'CodeCrumbEdge-flow-selected': selected
        })}
        onClick={onClick}
      />
      <polyline
        points={polylinePoints.join(', ')}
        className={'EdgeMouseHandler'}
        onClick={onClick}
      />
      <rect
        x={sourcePt.x - 1.5}
        y={sourcePt.y}
        width={3}
        height={2}
        className={classNames('CodeCrumbEdge-flow-source', {
          'CodeCrumbEdge-flow-source-selected': selected
        })}
      />
      <Arrow
        x={endPointConfig.x}
        y={endPointConfig.y}
        height={iconSize}
        width={iconSize}
        fill={selected ? '#754BC3' : '#e91e63'}
      />
    </g>
  );
};

export const ExternalEdge = props => {
  const {
    sourcePosition,
    targetPosition,
    singleCrumbSource,
    singleCrumbTarget,
    topBottom,
    areaHeight,
    firstPart,
    onClick
  } = props;

  const rHalf = 6;
  const sourcePt = {
    x: -rHalf + (singleCrumbSource ? sourcePosition.x - 22 : sourcePosition.x),
    y: sourcePosition.y + rHalf
  };
  const targetPt = {
    x: -rHalf + (singleCrumbTarget ? targetPosition.x - 22 : targetPosition.x),
    y: targetPosition.y - rHalf
  };

  const padding = 21 - rHalf;
  const vTurn = 12;

  const points = firstPart
    ? [
        [sourcePt.x, sourcePt.y],
        [sourcePt.x, sourcePt.y + padding],
        [targetPt.x + (topBottom ? 0 : -12), sourcePt.y + padding],
        [targetPt.x + (topBottom ? 0 : -12), topBottom ? areaHeight : 0]
      ]
    : topBottom
      ? [
          [targetPt.x - 12, topBottom ? areaHeight : 0],
          [targetPt.x - 12, targetPt.y - vTurn],
          [targetPt.x - 1, targetPt.y - vTurn],
          [targetPt.x - 1, targetPt.y]
        ]
      : [[targetPt.x, topBottom ? areaHeight : 0], [targetPt.x, targetPt.y]];

  const iconSize = 8;
  return (
    <g className={'CodeCrumbEdge'}>
      <polyline points={points.join(', ')} className={'CodeCrumbEdge-flow'} onClick={onClick} />
      <polyline points={points.join(', ')} className={'EdgeMouseHandler'} onClick={onClick} />
      {firstPart ? (
        <rect
          x={sourcePt.x - 1}
          y={sourcePt.y}
          width={3}
          height={2}
          className={'CodeCrumbEdge-flow-source'}
        />
      ) : (
        <Arrow
          x={targetPt.x - 5}
          y={targetPt.y - iconSize}
          height={iconSize}
          width={iconSize}
          fill={'#e91e63'}
        />
      )}
    </g>
  );
};
