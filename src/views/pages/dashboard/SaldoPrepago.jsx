import {
    CButton, CCard, CCol, CImg, CInput, CLink, CRow
} from '@coreui/react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import { AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import { useEffect, useState, useMemo } from 'react';
import DatePicker from "react-datepicker";
import { isMobile } from 'react-device-detect';
import { useToasts } from 'react-toast-notifications';
import {
    useHistory
} from "react-router-dom";

import "react-datepicker/dist/react-datepicker.css";
import { reactLocalStorage } from 'reactjs-localstorage';
import ButtonCellRenderer from './cell_renderer/ButtonCellRenderer';
import DescargarCellRenderer from './cell_renderer/DescargarCellRenderer';
import IdCellRenderer from './cell_renderer/IdCellRenderer';
import { element } from 'prop-types';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

function CrossSelling(props) {

    const history = useHistory();
    const [input_search, setInputSearch] = useState("");
    const [aggrid, setAggrid] = useState(null);
    const [number_rows, setNumberRows] = useState("20");
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [urlRecarga, setUrlRecarga] = useState("https://app.recurrente.com/s/conecta-guate");
    const size = useWindowSize();
    const { addToast } = useToasts();
    const [saldoActual, setSaldoActual] = useState(0);

    const [column_definitions, setColumnDefinitions] = useState({
        columnDefs: [
            {
                headerName: 'Monto',
                field: 'monto',
            },
            {
                headerName: 'Referencia',
                field: 'referencia'
            },
            {
                headerName: 'Fecha',
                field: 'fecha'
            }
        ],
        rowData: [],
        defaultColDef: {
            resizable: true,
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputSearch(value);
        onFilterTextBoxChanged();
    }

    const onFilterTextBoxChanged = () => {
        aggrid.api.setQuickFilter(document.getElementById('guia').value);
    }

    const onBtnExport = () => {
        aggrid.api.exportDataAsCsv();
    };

    const onPageSizeChanged = () => {
        var value = document.getElementById('page-size').value;
        aggrid.api.paginationSetPageSize(Number(value));
        setNumberRows(value);
    };

    const searchDate = () => {
        let data = column_definitions.rowDataWithoutFilter;
        let date_filter = data.filter((elem) => {
            let start = new Date(startDate);
            let end = new Date(endDate);
            let date_filtered = new Date(elem.date_created);
            if (date_filtered > start && date_filtered < end) {
                return true;
            }
        })
        setColumnDefinitions({
            ...column_definitions,
            rowData: date_filter
        })
    }

    const onGridReady = (params) => {
        setAggrid({ api: params.api, column_api: params.columnApi });
        if (!isMobile || size > 992) {
            params.api.sizeColumnsToFit();
        }
    }

    const excelStyles = useMemo(() => {
        return [
            {
                id: 'multiline',
                alignment: {
                    wrapText: true,
                },
            },
        ];
    }, []);

    function useWindowSize() {
        // Initialize state with undefined width/height so server and client renders match
        // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
        const [windowSize, setWindowSize] = useState({
            width: undefined,
            height: undefined,
        });
        useEffect(() => {
            // Handler to call on window resize
            function handleResize() {
                // Set window width/height to state
                setWindowSize({
                    width: window.innerWidth,
                    height: window.innerHeight,
                });
            }
            // Add event listener
            window.addEventListener("resize", handleResize);
            // Call handler right away so state gets updated with initial window size
            handleResize();
            // Remove event listener on cleanup
            return () => window.removeEventListener("resize", handleResize);
        }, []); // Empty array ensures that effect is only run on mount
        return windowSize;
    }

    useEffect(() => {
        const user_object = reactLocalStorage.getObject('user');
        if (user_object === 'undefined' || user_object === undefined || user_object === null || Object.keys(user_object).length === 0) {
            reactLocalStorage.remove('user');
            history.push('/login');
        }

        const config = {
            headers: {
                "Authorization": `Bearer ${user_object.token}`
            }
        };

        axios.get(
            'https://ws.conectaguate.com/api/v1/site/planactual',
            config
        ).then(async (response) => {
            if (response.data.ConfSaldo != undefined && response.data.ConfSaldo != null) {
                setUrlRecarga("https://app.recurrente.com/s/conecta-guate/pagar");
            }
        });

        axios.get(
            'https://ws.conectaguate.com/api/v1/saldo',
            config
        ).then(async (response) => {
            let result = response.data['Recargas'];
            let registros = [];

            result.forEach(r => {
                let date = new Date(r.created_at);
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                let dt = date.getDate();
                if (dt < 10) {
                    dt = '0' + dt;
                }
                if (month < 10) {
                    month = '0' + month;
                }
                const newDate = dt + '/' + month + '/' + year;
                registros.push({
                    monto: `Q${r.monto}`,
                    referencia: r.referencia,
                    fecha: newDate
                });
            });
            const saldoActual = result.reduce((acumulado, saldo) => { return acumulado + parseFloat(saldo.monto) }, 0);
            setSaldoActual(saldoActual);
            setColumnDefinitions({
                ...column_definitions,
                rowData: registros,
                rowDataWithoutFilter: registros
            });

        }).catch(error => {
            try {

                if (error.hasOwnProperty('response')) {
                    addToast(`Error: ${error.response.data.Message}`, {
                        appearance: 'warning',
                        autoDismiss: true,
                        autoDismissTimeout: 3000
                    });
                } else {
                    addToast(`Error: ${error}`, {
                        appearance: 'warning',
                        autoDismiss: true,
                        autoDismissTimeout: 3000
                    });
                }
            } catch (e) {
                addToast('Error: no se pudo realizar la solicitud de saldos.', {
                    appearance: 'error',
                    autoDismiss: true,
                    autoDismissTimeout: 3000
                });
            } finally {
                return;
            }
        });

    }, []);

    return (
        <>
            <div className="mis-envios-container">
                <CRow className="table-container">
                    <CCol className="text-right" style={{ marginLeft: 'auto' }} col="6" sm="12" md="6">
                        <label className='text-center' style={{ textAlign: 'center', fontSize: '2em', marginRight: '10px', fontWeight: 'bold' }}> Saldo Prepago disponible: <span style={{ marginLeft: '20px' }}> Q{saldoActual}</span></label>
                        <br />
                        <CLink
                            className="btn button_filters ml-auto"
                            style={{
                                background: 'rgb(86 124 189)',
                                color: 'white',
                                fontWeight: '500'
                            }}
                            href={urlRecarga.toString()}
                            target='_blank'
                        >
                            Recargar
                        </CLink>
                    </CCol>
                </CRow>
                <CRow className="table-container">
                    <CCol>
                        <select
                            id="page-size"
                            className="card-input"
                            onChange={() => onPageSizeChanged()}
                            style={{
                                background: 'white',
                                border: '0px',
                                color: '#768192',
                                marginLeft: '1rem',
                                padding: '.5rem',
                                borderRadius: '5px'
                            }}
                            value={number_rows}
                        >
                            <option value="20">
                                20
                            </option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                            <option value="1000">All</option>
                        </select>
                    </CCol>
                </CRow>
                <br />
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
                                onGridReady={onGridReady}
                                frameworkComponents={{
                                    btnCellRenderer: ButtonCellRenderer,
                                    btnCellRendererDescargar: DescargarCellRenderer,
                                    idBtnCellRenderer: IdCellRenderer
                                }}
                                pagination={true}
                                paginationPageSize={10}
                                defaultColDef={column_definitions.defaultColDef}
                                excelStyles={excelStyles}
                            />
                        </div>
                    </CCol>
                </CRow>
            </div >
        </>
    )
}


export default CrossSelling

