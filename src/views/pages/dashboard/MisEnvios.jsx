import React, { lazy, Fragment, useState, useEffect, useRef} from 'react'
import {isMobile} from 'react-device-detect';
import {
    CBadge,
    CButton,
    CButtonGroup,
    CCard,
    CCardBody,
    CCardFooter,
    CCardHeader,
    CCol,
    CProgress,
    CRow,
    CCallout,
    CFormGroup,
    CLabel,
    CInput,
    CSwitch,
    CInputGroupAppend,
    CInputGroup,
    CInputGroupText,
    CContainer,
    CCollapse,
    CSelect,
    CImg
  } from '@coreui/react'
  import { ToastProvider, useToasts } from 'react-toast-notifications';
  import axios from 'axios';
  import { 
      useHistory,
      useRouteMatch,
      useParams
  } from "react-router-dom";
  import { AgGridReact, AgGridColumn } from 'ag-grid-react';
  import 'ag-grid-community/dist/styles/ag-grid.css';
  import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
  import 'ag-grid-community/dist/styles/ag-theme-material.css';
  import CIcon from '@coreui/icons-react';
  import DatePicker from "react-datepicker";

  import "react-datepicker/dist/react-datepicker.css";
  import ButtonCellRenderer from './cell_renderer/ButtonCellRenderer'
  import DescargarCellRenderer from './cell_renderer/DescargarCellRenderer'
  import IdCellRenderer from './cell_renderer/IdCellRenderer'
  import {reactLocalStorage} from 'reactjs-localstorage';


function MisEnvios(props) {
    const size = useWindowSize();
    const history = useHistory();
    const [number_rows, setNumberRows] = useState("20");
    const [aggrid,  setAggrid] = useState(null);
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [input_search, setInputSearch] = useState("");
    const [user, setUser] = useState({});
    const [transportes, setTransportes] = useState(null);
    const [estatus, setEstatus] = useState(null);
    const [tipos_de_pago, setTiposDePago] = useState(null);
    const [column_definitions, setColumnDefinitions] = useState({
        columnDefs: [
            { 
                headerName: 'Pedido', 
                field: 'pedido',
            },
            { 
                headerName: 'Destinatario', 
                field: 'destinatario' },
            { 
                headerName: 'Destino', 
                field: 'destino' },
            { 
                headerName: 'Tipo de envio', 
                field: 'tipo_de_envio' },
            { 
                headerName: 'Creación', 
                field: 'fecha_creacion' },
            { 
                headerName: 'Estado', 
                field: 'estado',
                cellRenderer: 'idBtnCellRenderer',
                cellRendererParams: {
                    clicked: function(field) {
                    alert(`${field} was clicked`);
                    },
                }, 
            },
            { 
                haederName: '',  
                field: 'Descargar',
                cellRenderer: 'btnCellRendererDescargar',
                cellRendererParams: {
                    clicked: function(url) {
                        let  getUrl = window.location;
                        let  baseUrl = getUrl.protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];
                        url = `${baseUrl}#/tracking/${url}`
                        window.open(url, '_blank').focus();
                    },
                  },
            },
            { 
                haederName: '',  
                field: 'link',
                cellRenderer: 'btnCellRenderer',
                cellRendererParams: {
                    clicked: function(url) {
                        let  getUrl = window.location;
                        let  baseUrl = getUrl.protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];
                        url = `${baseUrl}#/tracking/${url}`
                        window.open(url, '_blank').focus();
                    },
                  },
            }
        ],
        rowData: [],
        defaultColDef: {
            resizable: true,
        }
    });

    function randomDate(start, end) {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }
      

    // Hook
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

    useEffect(()=>{
        setColumnDefinitions({
            ...column_definitions,
        })
        setLoading(true);

    },[])

    useEffect(()=>{
        const user_object = reactLocalStorage.getObject('user');

        if(user_object === 'undefined' || user_object === undefined || user_object === null || Object.keys(user_object).length === 0){
            reactLocalStorage.remove('user');
            setUser({});
            history.push('/login');
            return false;
        }
        let base_url = 'https://ws.conectaguate.com/api'

        let transportes = new Promise((resolve, reject) => axios({method:'get',url:base_url+'/v1/site/transportes',headers: {'Authorization': `Bearer ${user_object.token}`}}).then((data)=>resolve({key: 'transportes', data:data.data['Data']},'transportes')));
        let estatus = new Promise((resolve, reject) => axios({method:'get',url:base_url+'/v1/site/estatus',headers: {'Authorization': `Bearer ${user_object.token}`}}).then((data)=>resolve({key: 'estatus', data:data.data['Data']},'estatus')));
        let tipos_de_pago = new Promise((resolve, reject) => axios({method:'get',url:base_url+'/v1/site/tipopago',headers: {'Authorization': `Bearer ${user_object.token}`}}).then((data)=>resolve({key: 'tipos_de_pago', data:data.data['Data']},'tipos_de_pago')));

        Promise.all([transportes,estatus,tipos_de_pago]).then((values) => {
            values.forEach((elem)=>{
                let obj = {};
                switch(elem.key){
                    case 'transportes':
                        elem.data.forEach((elem)=>{
                            obj[elem.id] = elem;
                        })
                        setTransportes(obj);
                        break;
                    case 'estatus':
                        elem.data.forEach((elem)=>{
                            obj[elem.id] = elem;
                        })
                        setEstatus(obj);
                        break;
                    case 'tipos_de_pago':
                        elem.data.forEach((elem)=>{
                            obj[elem.id] = elem;
                        })
                        setTiposDePago(obj);
                        break;
                    default:
                        ;
                }
            })
            console.log(values);
        });
    },[]);

    const handleChange = (e) =>{
        const {name, value} = e.target;
        setInputSearch(value);
        onFilterTextBoxChanged();
    }

    const onGridReady = (params) =>{
        setAggrid({api: params.api, column_api:params.columnApi});
        if(!isMobile || size > 992) {
            params.api.sizeColumnsToFit();
        }   
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

    useEffect(()=>{
        if(transportes !== null && estatus !== null && tipos_de_pago !== null){
            const user_object = reactLocalStorage.getObject('user');
            let bearer = "";
            console.log(user_object);

            if(user_object === 'undefined' || user_object === undefined || user_object === null || Object.keys(user_object).length === 0){
                reactLocalStorage.remove('user');
                history.push('/login');
            }else{  
                bearer =  `Bearer ${user_object.token}`;
            }   

            const config = {
                headers: { 
                    "Authorization": bearer
                }
            };

            axios.get(
                'https://ws.conectaguate.com/api/v1/site/user/pedidos/',
                config
            ).then((response)=>{
                let data_arr = [];
                let data = response.data['Data'];
                let i = 1;

                data.forEach((elem)=>{
                    console.log(elem);
                    if(elem.created_at){
                        let date = new Date(elem.created_at);
                        let year = date.getFullYear();
                        let month = date.getMonth()+1;
                        let dt = date.getDate();
                        if (dt < 10) {
                        dt = '0' + dt;
                        }
                        if (month < 10) {
                        month = '0' + month;
                        }
                        elem.fecha_creacion = dt+'/'+month+'/'+year;
                    }
                

                    let object ={ 
                        pedido: elem.id, 
                        destinatario: elem.nombre_destino, 
                        destino: elem.direccion_destino,
                        tipo_de_envio: tipos_de_pago[elem.tipo_pago] ? tipos_de_pago[elem.tipo_pago].nombre : "N/A", 
                        estado: elem.status, 
                        link: elem.guia,
                        fecha_creacion: elem.fecha_creacion,
                        date_created: elem.created_at,
                        fecha_entrega: ""
                    };
                    data_arr.push(object);
                    i++;
                })

                setColumnDefinitions({
                    ...column_definitions,
                    rowData: data_arr,
                    rowDataWithoutFilter: data_arr
                })
            });
        }
    },[transportes, estatus, tipos_de_pago]);


    const searchDate = () =>{
        let data = column_definitions.rowDataWithoutFilter;
        let date_filter = data.filter((elem)=>{
            let start = new Date(startDate);
            let end = new Date(endDate);
            let date_filtered = new Date(elem.date_created);
            if(date_filtered > start && date_filtered < end){
                return true;
            }
        })
        setColumnDefinitions({
            ...column_definitions,
            rowData: date_filter
        })
    }
    

    return (
        (loading) ?
        <>
        <div className="mis-envios-container">
                <CRow>
                    <CCol sm="12">
                        <CCard className="card-header">
                            <div className="mis-envios-title">
                                Monitorea tus pedidos
                            </div>
                        </CCard>    
                       
                    </CCol>
                </CRow>  
                <CRow className="filter-container">
                    <CCol sm="3" className="filter-row-responsive">
                        <CRow>
                            No. de Guía
                        </CRow>
                        <CRow>
                            <CInput 
                                type="text" 
                                id="guia" 
                                className="filter-container-input"  
                                value={input_search}
                                placeholder="" 
                                style={{background:'white', border: '0px'}}
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
                                selected={startDate}
                                id="fecha-ini" 
                                className="filter-container-input form-control"  
                                onChange={(date) => {
                                    console.log(date);
                                    setStartDate(date)
                                }} 
                                style={{
                                    background:'white', 
                                    border: '0px',
                                    textAlign: 'left'
                                }}
                                maxDate={endDate}
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
                                selected={endDate}
                                id="fecha-fin" 
                                className="filter-container-input form-control"  
                                onChange={(date) => {
                                    console.log(date);
                                    setEndDate(date)
                                }} 
                                style={{
                                    background:'white', 
                                    border: '0px',
                                    textAlign: 'left'
                                }}
                                minDate={startDate}
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
                                        background:'#f3bf34', 
                                        fontWeight: '500'
                                    }}
                                    onClick={searchDate}
                                    >   
                                        <CRow>
                                            <CCol sm="3" 
                                                >
                                                <CImg
                                                src={`img/icons/mis-envios/buscar.svg`}
                                                fluid
                                                style={{width:'25px', cursor:'pointer'}}
                                            />
                                            </CCol>
                                            <CCol
                                                className="export_button">
                                                Aplicar
                                            </CCol>
                                        </CRow>
                                </CButton>
                            </CCol>
                            <CCol col="6" sm="12" md="12" xl  className="mb-3 mb-xl-0"> 
                                <CButton 
                                    block 
                                    className="button_filters"
                                    style={{
                                        background:'#afc7ff', 
                                        fontWeight: '500'
                                    }}
                                    onClick={() => onBtnExport()}
                                    >   
                                        <CRow>
                                            <CCol sm="3" 
                                                >
                                                <CImg
                                                    src={`img/icons/mis-envios/exportar.svg`}
                                                    fluid
                                                    style={{width:'25px', cursor:'pointer'}}
                                                />
                                            </CCol>
                                            <CCol
                                                className="export_button">
                                                Exportar
                                            </CCol>
                                        </CRow>
                                </CButton>
                            </CCol>
                        </CRow>
                    </CCol>
                </CRow>  
                <CRow className="table-container">
                    <CCol>
                        <select 
                            id="page-size"
                            className="card-input" 
                            onChange={() => onPageSizeChanged()} 
                            style={{
                                background:'white', 
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
                <CRow className="table-container" style={{marginBottom: '2rem'}}>
                    <CCol sm="12">
                        <div id="myGrid" style={{height: '600px'}} className="ag-theme-material">
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
                            />
                        </div>
                    </CCol>
                </CRow>
        </div>
        </> : <></>
    )
}

MisEnvios.propTypes = {

}

export default MisEnvios

