import React, { Component } from 'react'
import {
    CImg,
  } from '@coreui/react'

export default class BtnCellRenderer extends Component {
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
            name="cil-file"
            onClick={this.btnClickedHandler}
            src={`img/icons/mis-envios/guia.svg`}
            fluid
            style={{width:'40px', cursor:'pointer'}}
        />
      )
    }
  }