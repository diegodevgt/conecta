import React, { Component } from 'react'
import {
  CImg
} from '@coreui/react'

export default class BtnCellRendererModal extends Component {
  constructor(props) {
    super(props);
    this.btnClickedHandler = this.btnClickedHandler.bind(this);
  }
  btnClickedHandler() {
    this.props.clicked(this.props.value, this.props.data.estado);
  }
  render() {
    return (
        <CImg
          name="cil-file"
          src={`img/icons/mis-envios/guia.svg`}
          onClick={this.btnClickedHandler}
          style={{ width: '40px', cursor: 'pointer', fill: '#153b75 !important' }}
          fluid
        />
    )
  }
}