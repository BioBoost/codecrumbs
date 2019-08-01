import React from 'react';
import { connect } from 'react-redux';

import { DependenciesEdge, DependenciesArrow } from '../../Edge/DepenenciesEdge';
import { FileName } from '../../../component/Node/File';
import { selectDependencyEdge } from '../../../../../core/dataBus/actions';
import {
  getSourceLayout,
  getSourceUserChoice,
  getDependenciesUserChoice
} from '../../../../../core/dataBus/selectors';
import { getCheckedState } from '../../../../../core/controlsBus/selectors';

import { getGroupsAroundNode, checkIsEdgeSelected } from './utils';

const DependenciesTree = props => {
  const {
    language,
    selectedNode,
    filesLayoutMap,
    shiftToCenterPoint,
    sourceDiagramOn,
    onDependencyEdgeClick,
    selectedDependencyEdgeNodes
  } = props;

  if (!selectedNode || !selectedNode.dependencies) {
    return null;
  }

  const selectedNodeDependencies = selectedNode.dependencies[selectedNode.path];
  return (
    <React.Fragment>
      {selectedNodeDependencies &&
        [selectedNodeDependencies].map(({ moduleName, importedModuleNames }) => {
          const moduleNode = filesLayoutMap[moduleName];
          if (!moduleNode) return null;

          const { name, path } = moduleNode.data;
          const [mX, mY] = [moduleNode.y, moduleNode.x];
          const targetPosition = shiftToCenterPoint(mX, mY);
          const sourceNodes = [];
          if (!sourceDiagramOn) {
            // TODO: un sync with FileName in SourceTree, duplication
            sourceNodes.push(
              <FileName
                language={language}
                key={path}
                position={targetPosition}
                name={name}
                dependency={true}
              />
            );
          }

          const importedNodes = importedModuleNames
            .map(name => filesLayoutMap[name])
            .filter(node => !!node);

          const edges = [];
          const selectedEdges = [];

          Object.entries(getGroupsAroundNode(moduleNode, importedNodes)).forEach(
            ([groupName, groupNodes]) => {
              if (!groupNodes.length) {
                return;
              }

              // swap here as well
              const firstSourceNode = groupNodes[0];
              const firstSourcePosition = shiftToCenterPoint(firstSourceNode.y, firstSourceNode.x);
              groupNodes.forEach((importedNode, i) => {
                const [iX, iY] = [importedNode.y, importedNode.x];
                const sourcePosition = shiftToCenterPoint(iX, iY);
                const { path: importedNodePath, name } = importedNode.data;

                const selected =
                  selectedDependencyEdgeNodes &&
                  checkIsEdgeSelected(selectedDependencyEdgeNodes, moduleName, importedNodePath);

                const edge = (
                  <DependenciesEdge
                    key={`dep-edge-${importedNodePath}-${sourcePosition.x}-${targetPosition.x}`}
                    anyEdgeSelected={!!selectedDependencyEdgeNodes}
                    selected={selected}
                    groupName={groupName}
                    sourcePosition={sourcePosition}
                    targetPosition={targetPosition}
                    firstSourcePosition={i ? firstSourcePosition : null}
                    onClick={() =>
                      onDependencyEdgeClick({
                        target: moduleName,
                        sources: [importedNodePath],
                        groupName
                      })
                    }
                  />
                );
                selected ? selectedEdges.push(edge) : edges.push(edge);

                if (!i) {
                  const arrowSelected =
                    selectedDependencyEdgeNodes &&
                    groupName === selectedDependencyEdgeNodes.groupName &&
                    checkIsEdgeSelected(selectedDependencyEdgeNodes, moduleName);

                  const arrow = (
                    <DependenciesArrow
                      key={`dep-arrow-${importedNodePath}-${groupName}`}
                      selected={arrowSelected}
                      groupName={groupName}
                      targetPosition={targetPosition}
                    />
                  );
                  arrowSelected ? selectedEdges.push(arrow) : edges.push(arrow);
                }

                if (!sourceDiagramOn) {
                  sourceNodes.push(
                    <FileName
                      key={importedNodePath}
                      language={language}
                      position={sourcePosition}
                      name={name}
                      dependency={true}
                    />
                  );
                }
              });
            }
          );

          return (
            <React.Fragment key={moduleName}>
              {edges}
              {selectedEdges}
              {sourceNodes}
            </React.Fragment>
          );
        })}
    </React.Fragment>
  );
};

const mapStateToProps = (state, props) => {
  const { sourceDiagramOn } = getCheckedState(state);

  const { namespace } = props;
  const namespaceProps = { namespace };
  const { filesLayoutMap } = getSourceLayout(state, namespaceProps);
  const { selectedNode } = getSourceUserChoice(state, namespaceProps);
  const { selectedDependencyEdgeNodes } = getDependenciesUserChoice(state, namespaceProps);

  return {
    sourceDiagramOn,
    filesLayoutMap,
    selectedNode,
    selectedDependencyEdgeNodes
  };
};

const mapDispatchToProps = (dispatch, props) => {
  const { namespace } = props;
  return {
    onDependencyEdgeClick: options => dispatch(selectDependencyEdge(options, namespace))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DependenciesTree);
