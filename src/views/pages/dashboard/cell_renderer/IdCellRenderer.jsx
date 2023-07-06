import React, { Component } from 'react'
import CIcon from '@coreui/icons-react';

export default class IdCellRenderer extends Component {
    constructor(props) {
        super(props);
        this.btnClickedHandler = this.btnClickedHandler.bind(this);
    }
    btnClickedHandler() {
        this.props.clicked(this.props.value);
    }

    render() {
        let background = '';
        let color = '';
        switch (this.props.value) {
            case 'Cancelado':
                background = '#e67e22';
                color = '#ffffff';
                break;
            case 'Liquidado':
                background = '#3498db';
                color = '#ffffff';
                break;
            case 'Devolución':
                background = '#e67e22';
                color = '#ffffff';
                break;
            case 'Recibido':
                background = '#bdc3c7';
                color = '#000000';
                break;
            case 'Creado':
                background = '#bdc3c7';
                color = '#000000';
                break;
            case 'Almacen':
                background = '#9b59b6';
                color = '#ffffff';
                break;
            case 'Transito':
                background = '#f1c40f';
                color = '#ffffff';
                break;
            case 'Completada':
                background = '#2ecc71';
                color = '#ffffff';
                break;
            default:
                ;
        }
        return (
            <div
                style={{
                    display: 'block',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    marginTop: '.5rem'
                }}>
                <p style={{
                    background: background,
                    color: color,
                    textAlign: 'center',
                    display: 'block',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    width: 'fit-content',
                    paddingLeft: '.3rem',
                    paddingRight: '.3rem',
                    paddingBottom: '.05rem',
                    paddingTop: '.05rem',
                    borderRadius: '15px',
                    lineHeight: '30px'
                }}>
                    {this.props.value}
                </p>
            </div>

        )
    }
}