import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';

import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState } from 'react';
import {
    CButton, CCard, CCol, CImg, CInput, CRow
} from '@coreui/react';
import DatePicker from "react-datepicker";
import { AgGridReact } from 'ag-grid-react';
import ButtonCellRenderer from './cell_renderer/ButtonCellRenderer';
import DescargarCellRenderer from './cell_renderer/DescargarCellRenderer';
import IdCellRenderer from './cell_renderer/IdCellRenderer';
import { reactLocalStorage } from 'reactjs-localstorage';
import { useHistory } from "react-router-dom";
import axios from 'axios';

function Cupones(props) {

    const history = useHistory();
    const now = new Date();
    const [formulario, setFormulario] = useState({
        cupon: "TODOS",
        fechaInicial: new Date(now.getFullYear(), now.getMonth() - 6, 1),
        fechaFinal: new Date(now.getFullYear(), now.getMonth() + 6, 0)
    });

    useEffect(() => {
        obtenerdatos();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const datos = formulario;

        setFormulario({
            ...datos,
            [name]: value
        });
    }

    const asignarFechaInicial = (fecha) => {
        const datos = formulario;
        setFormulario({
            ...datos,
            'fechaInicial': fecha
        });
    }

    const asignarFechaFinal = (fecha) => {
        const datos = formulario;
        setFormulario({
            ...datos,
            'fechaFinal': fecha
        });
    }

    const obtenerdatos = () => {
        const user_object = reactLocalStorage.getObject('user');
        let bearer = "";

        if (user_object === 'undefined' || user_object === undefined || user_object === null || Object.keys(user_object).length === 0) {
            reactLocalStorage.remove('user');
            history.push('/login');
        } else {
            bearer = `Bearer ${user_object.token}`;
        }

        const config = {
            headers: {
                "Authorization": bearer
            }
        };

        const inicial = `${formulario.fechaInicial.getFullYear()}-${formulario.fechaInicial.getMonth() + 1}-${formulario.fechaInicial.getDate()}`;
        const final = `${formulario.fechaFinal.getFullYear()}-${formulario.fechaFinal.getMonth() + 1}-${formulario.fechaFinal.getDate()}`;

        axios.get(
            `https://ws.conectaguate.com/api/v1/site/cupones/usuarios?fechaInicial=${inicial}&fechaFinal=${final}&cupon=${formulario.cupon}`,
            config
        ).then(async (response) => {
            setColumnDefinitions({
                ...column_definitions,
                rowData: response.data['Datos'],
                rowDataWithoutFilter: response.data['Datos']
            });
        });
    }

    const buscarCupones = () => {
        obtenerdatos();
    }

    const [column_definitions, setColumnDefinitions] = useState({
        columnDefs: [
            {
                headerName: 'Cupon',
                field: 'cupon',
            },
            {
                headerName: 'Tipo',
                field: 'tipo'
            },
            {
                headerName: 'Cantidad',
                field: 'cantidad'
            },
            {
                headerName: 'Valor',
                field: 'valor'
            },
            {
                headerName: 'Aplicados',
                field: 'aplicados'
            },
            {
                headerName: 'Creación',
                field: 'fechaCreacion'
            },
            {
                headerName: 'Expiración',
                field: 'fechaExpiracion'
            }
        ],
        rowData: [],
        defaultColDef: {
            resizable: true,
        }
    });

    return (
        <>
            <div className="mis-envios-container">
                <CRow>
                    <CCol sm="12">
                        <CCard className="card-header">
                            <div className="mis-envios-title">
                                Mis Cupones
                            </div>
                        </CCard>

                    </CCol>
                </CRow>
                <CRow className="filter-container">
                    <CCol sm="3" className="filter-row-responsive">
                        <CRow>
                            Cupon
                        </CRow>
                        <CRow>
                            <CInput
                                type="text"
                                id="cupon"
                                name="cupon"
                                className="filter-container-input"
                                value={formulario.cupon}
                                placeholder=""
                                style={{ background: 'white', border: '0px' }}
                                onChange={handleChange}
                            />
                        </CRow>
                    </CCol>
                    <CCol sm="3" className="filter-row-responsive">
                        <CRow>
                            Inicio
                        </CRow>
                        <CRow>
                            <DatePicker
                                selected={formulario.fechaInicial}
                                id="fechaInicial"
                                name="fechaInicial"
                                className="filter-container-input form-control"
                                onChange={asignarFechaInicial}
                                style={{
                                    background: 'white',
                                    border: '0px',
                                    textAlign: 'left'
                                }}
                                maxDate={formulario.fechaFinal}
                                dateFormat="dd/MM/yyyy"
                            />
                        </CRow>
                    </CCol>
                    <CCol sm="3" className="filter-row-responsive">
                        <CRow>
                            Finalización
                        </CRow>
                        <CRow>
                            <DatePicker
                                selected={formulario.fechaFinal}
                                id="fechaFinal"
                                name="fechaFinal"
                                className="filter-container-input form-control"
                                onChange={asignarFechaFinal}
                                style={{
                                    background: 'white',
                                    border: '0px',
                                    textAlign: 'left'
                                }}
                                minDate={formulario.fechaInicial}
                                dateFormat="dd/MM/yyyy"
                            />
                        </CRow>
                    </CCol>
                    <CCol sm="3">
                        <CRow>
                            &nbsp;
                        </CRow>
                        <CRow className="row_button_filters">
                            <CCol col="6" sm="12" md="12" xl className="mb-3 mb-xl-0">
                                <CButton
                                    block
                                    className="button_filters"
                                    style={{
                                        background: '#f3bf34',
                                        fontWeight: '500'
                                    }}
                                    onClick={buscarCupones}
                                >
                                    <CRow>
                                        <CCol sm="3"
                                        >
                                            <CImg
                                                src={`img/icons/mis-envios/buscar.svg`}
                                                fluid
                                                style={{ width: '25px', cursor: 'pointer' }}
                                            />
                                        </CCol>
                                        <CCol
                                            className="export_button">
                                            Aplicar
                                        </CCol>
                                    </CRow>
                                </CButton>
                            </CCol>
                        </CRow>
                    </CCol>
                </CRow>
                <CRow className="table-container" style={{ marginBottom: '2rem' }}>
                    <CCol sm="12">
                        <div id="myGrid" style={{ height: '600px' }} className="ag-theme-material">
                            <AgGridReact

                                // turn on AG Grid React UI
                                reactUi="true"
                                className="ag-theme-material"
                                animateRows="true"
                                columnDefs={column_definitions.columnDefs}
                                rowData={column_definitions.rowData}
                                rowSelection="multiple"
                                groupSelectsChildren="true"
                                suppressRowClickSelection="true"
                                frameworkComponents={{
                                    btnCellRenderer: ButtonCellRenderer,
                                    btnCellRendererDescargar: DescargarCellRenderer,
                                    idBtnCellRenderer: IdCellRenderer
                                }}
                                pagination={true}
                                paginationPageSize={10}
                                defaultColDef={column_definitions.defaultColDef}
                            />
                        </div>
                    </CCol>
                </CRow>
            </div>
        </>
    )
}

Cupones.propTypes = {

}

export default Cupones

