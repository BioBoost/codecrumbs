import React from 'react';
import { connect } from 'react-redux';

import Button from 'antd/es/button';
import 'antd/es/button/style';

const ButtonGroup = Button.Group;

import { setZoom } from '../../../../core/controlsBus/actions';
import { getValuesState } from '../../../../core/controlsBus/selectors';
import './index.less';

const ZoomControl = ({ zoom, setZoom }) => {
  const step = 0.1;
  //TODO: doesn't work proper scaling
  return null;

  return (
    <div className={'ZoomControl'}>
      <ButtonGroup size={'small'}>
        <Button icon="zoom-out" disabled={zoom <= step} onClick={() => setZoom(zoom - step)} />
        <Button icon="border" disabled={zoom === 1} onClick={() => setZoom(1)} />
        <Button icon="zoom-in" onClick={() => setZoom(zoom + step)} />
      </ButtonGroup>
    </div>
  );
};

const mapStateToProps = state => {
  const { diagramZoom } = getValuesState(state);

  return {
    zoom: diagramZoom
  };
};

const mapDispatchToProps = {
  setZoom
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ZoomControl);
