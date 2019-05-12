import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import SourceTree from './Tree/Source/';
import CodeCrumbsDetails from './Tree/CodeCrumbs/Details';
import { UnderLayer } from './UnderLayer';
import './TreeDiagram.scss';

import { buildShiftToPoint } from 'core/dataBus/utils/geometry';
import {
  getProjectMetadata,
  getSourceLayout,
  getCodeCrumbsUserChoice,
  getNamespacesList
} from 'core/dataBus/selectors';
import { getCheckedState, getValuesState } from 'core/controlsBus/selectors';
import { selectDependencyEdge, selectCcFlowEdge } from 'core/dataBus/actions';
import { setActiveNamespace } from 'core/namespaceIntegration/actions';
import { gatherFlowStepsData } from './Tree/CodeCrumbs/helpers';

class TreeDiagram extends React.Component {
  render() {
    // TODO: fix diagramZoom
    const {
      namespace,
      projectName,
      codeCrumbsDiagramOn,
      multiple,
      active,
      diagramZoom,
      layoutSize,
      sourceLayoutTree,
      onUnderLayerClick,
      sortedFlowSteps,
      involvedNsData,
      ccShiftIndexMap
    } = this.props;

    if (!layoutSize) {
      return null;
    }

    const { width, height, xShift, yShift } = layoutSize;
    const shiftToCenterPoint = buildShiftToPoint({
      x: xShift,
      y: yShift
    });

    return (
      <div className={'TreeDiagram'}>
        {multiple ? (
          <p
            className={classNames('namespaceTitle', {
              activeTreeDiagram: multiple && active
            })}
          >
            {projectName}
          </p>
        ) : null}
        <svg
          width={width}
          height={height}
          xmlns="http://www.w3.org/2000/svg"
          shapeRendering="optimizeSpeed"
        >
          {sourceLayoutTree && (
            <React.Fragment>
              <UnderLayer width={width} height={height} onClick={onUnderLayerClick} />
              <SourceTree
                namespace={namespace}
                shiftToCenterPoint={shiftToCenterPoint}
                areaHeight={height}
                sortedFlowSteps={sortedFlowSteps}
                involvedNsData={involvedNsData}
                ccShiftIndexMap={ccShiftIndexMap}
              />
            </React.Fragment>
          )}
        </svg>
        {codeCrumbsDiagramOn ? (
          <CodeCrumbsDetails
            namespace={namespace}
            shiftToCenterPoint={shiftToCenterPoint}
            ccShiftIndexMap={ccShiftIndexMap}
            sortedFlowSteps={sortedFlowSteps}
          />
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  const { namespace } = props;
  const { sourceLayoutTree, layoutSize } = getSourceLayout(state, { namespace });
  const { projectName } = getProjectMetadata(state, { namespace });
  const { diagramZoom } = getValuesState(state);
  const { codeCrumbsDiagramOn } = getCheckedState(state);

  let extendedCcProps = {};
  if (codeCrumbsDiagramOn) {
    const codeCrumbsUserChoice = getCodeCrumbsUserChoice(state, {
      namespace
    });

    const { sortedFlowSteps, involvedNsData, ccShiftIndexMap } = gatherFlowStepsData(state, {
      currentSelectedCrumbedFlowKey: codeCrumbsUserChoice.selectedCrumbedFlowKey,
      namespacesList: getNamespacesList(state)
    });

    extendedCcProps = {
      sortedFlowSteps,
      involvedNsData,
      ccShiftIndexMap
    };
  }

  return {
    namespace,
    projectName,
    codeCrumbsDiagramOn,
    diagramZoom,
    sourceLayoutTree,
    layoutSize,
    ...extendedCcProps
  };
};

const mapDispatchToProps = (dispatch, props) => {
  const { namespace } = props;
  return {
    onUnderLayerClick: () => {
      dispatch(setActiveNamespace(namespace));
      dispatch(selectDependencyEdge(undefined, namespace));
      dispatch(selectCcFlowEdge(undefined, namespace));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TreeDiagram);
