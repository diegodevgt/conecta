import React, { Component } from 'react'
import {
    CImg,
  } from '@coreui/react'

export default class DescargarCellRenderer extends Component {
    constructor(props) {
      super(props);
      this.btnClickedHandler = this.btnClickedHandler.bind(this);
    }
    btnClickedHandler() {
     this.props.clicked(this.props.value);
    }
    render() {
      return (
        <CImg
            name="cil-action-undo"
            onClick={this.btnClickedHandler}
            src={`img/icons/mis-envios/exportar.svg`}
            fluid
            style={{width:'40px', cursor:'pointer', marginLeft:'auto', marginRight: 'auto', display:'block'}}
        />
      )
    }
  }