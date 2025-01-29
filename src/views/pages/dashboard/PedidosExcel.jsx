import {
    CButton, CCol, CRow
} from '@coreui/react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import axios from 'axios';
import { useState } from 'react';
import { useToasts } from 'react-toast-notifications';
import {
    useHistory
} from "react-router-dom";

import "react-datepicker/dist/react-datepicker.css";
import { reactLocalStorage } from 'reactjs-localstorage';
import { FileUploader } from "react-drag-drop-files";

function PedidosExcel() {

    const history = useHistory();
    const { addToast } = useToasts();
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const fileTypes = ["XLSX"];
    const [cargando, setCargando] = useState(false);

    const descargarExcel = () => {
        window.open("plantillaV1.1.xlsx");
    }

    const uploadFileExcel = async () => {
        const user_object = reactLocalStorage.getObject('user');
        if (user_object === 'undefined' || user_object === undefined || user_object === null || Object.keys(user_object).length === 0) {
            reactLocalStorage.remove('user');
            history.push('/login');
        }

        if (file === null || file === undefined) {
            addToast('Ingrese un archivo.', {
                appearance: 'warning',
                autoDismiss: true,
                autoDismissTimeout: 3000
            });
            return;
        }

        let formData = new FormData();
        formData.append("file", file);
        setCargando(true);
        await axios({
            method: 'post',
            url: `https://ws.conectaguate.com/api/v1/site/pedidos/creacion/excel`,
            headers: {
                "Authorization": `Bearer ${user_object.token}`,
                'Content-Type': 'application/json'
            },
            data: formData
        }).then((response) => {
            addToast('Se generaron los pedidos. Puedes ver tus pedidos en mis envios.', {
                appearance: 'success',
                autoDismiss: true,
                autoDismissTimeout: 3000
            });
            setFile(null);
            setCargando(false);
        }).catch((e) => {
            addToast(e.response.data.Message || 'No se pudo crear los pedidos.', {
                appearance: 'error',
                autoDismiss: true,
                autoDismissTimeout: 3000
            });
            console.log(e.data, e.message);
            setFile(null);
            setCargando(false);
        });
    }


    function DragDrop(props) {
        const handleChange = (file) => {
            props.setFile(file);
            setFileName(file.name);
        };

        return (
            <FileUploader handleChange={handleChange} name="file" types={fileTypes} />
        );
    }

    return (
        <>
            <div className="mis-envios-container">
                <CRow className="table-container">
                    <CCol className="text-right" style={{ marginLeft: 'auto' }} col="6" sm="12" md="6">
                        <CButton type="submit" size="sm" color="secondary" onClick={() => {
                            descargarExcel();
                        }}>
                            Descargar Excel de Ejemplo (V1.1)
                        </CButton>
                        {
                            !cargando ?
                                <CButton type="submit" size="sm" color="primary" onClick={() => {
                                    uploadFileExcel();

                                }}>
                                    Crear Pedidos
                                </CButton>
                                :
                                <span>
                                    <br />Cargando pedidos.
                                </span>
                        }
                    </CCol>
                </CRow>
                <CRow>
                    <CCol>
                        <DragDrop setFile={setFile} />
                        <strong>{fileName === '' ? 'Ingrese el Excel' : 'Seleccionado: ' + fileName + ' el proceso puede durar bastante tiempo en generar los pedidos.'}</strong>
                    </CCol>
                </CRow>
            </div >
        </>
    )
}


export default PedidosExcel

