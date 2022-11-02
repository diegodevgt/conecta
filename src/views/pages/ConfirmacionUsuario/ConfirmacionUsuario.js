import CIcon from '@coreui/icons-react';
import {
    CButton,
    CCard,
    CCardBody,
    CCardGroup,
    CCol,
    CContainer,
    CForm,
    CImg,
    CInput,
    CInputGroup,
    CInputGroupPrepend,
    CInputGroupText,
    CRow
} from '@coreui/react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { useToasts } from 'react-toast-notifications';
import { reactLocalStorage } from 'reactjs-localstorage';

const ConfirmacionUsuario = () => {
    const { addToast } = useToasts();
    const history = useHistory();

    const [codigo, setCodigo] = useState({
        codigo: ""
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        const form_object = JSON.parse(JSON.stringify(codigo));
        let new_data = {
            ...form_object,
            [id]: value
        };
        setCodigo(new_data);
    }

    const reenviarCodigo = () => {

        const user_object = reactLocalStorage.getObject('user');

        let bearer = "";

        if (user_object === 'undefined' || user_object === undefined || user_object === null || Object.keys(user_object).length === 0) {
            reactLocalStorage.remove('user');
            history.push('/login');
        } else {
            bearer = `Bearer ${user_object.token}`;
        }

        axios({
            method: 'post',
            url: 'https://ws.conectaguate.com/api/v1/site/confirmacion/usuario',
            headers: {
                'Authorization': bearer,
                'Content-Type': 'application/json'
            }
        }).then(
            (result) => {

                addToast(`${result.data.Message}`, {
                    appearance: 'success',
                    autoDismiss: true,
                    autoDismissTimeout: 4000
                });

            },
            (error) => {

                addToast(`${error.data.Message}`,
                    {
                        appearance: 'error',
                        autoDismiss: true,
                        autoDismissTimeout: 4000
                    });
            }
        );


    }

    useEffect(() => {
        const user = reactLocalStorage.getObject('user');
        if (Object.keys(user).length === 0) {
            history.push('/Login');
        }
    }, [])

    const onSubmit = () => {
        let error = false;
        let labels = {
            codigo: "Codigo"
        };

        const user_object = reactLocalStorage.getObject('user');

        let bearer = "";

        if (user_object === 'undefined' || user_object === undefined || user_object === null || Object.keys(user_object).length === 0) {
            reactLocalStorage.remove('user');
            history.push('/login');
        } else {
            bearer = `Bearer ${user_object.token}`;
        }

        let object_register = {
            codigo: codigo.codigo
        }

        axios({
            method: 'post',
            url: 'https://ws.conectaguate.com/api/v1/site/confirmacion/verificar',
            headers: {
                'Authorization': bearer,
                'Content-Type': 'application/json'
            },
            data: object_register,
        }).then(
            (result) => {

                addToast(`${result.data.Message}`, {
                    appearance: 'success',
                    autoDismiss: true,
                    autoDismissTimeout: 4000
                });

                history.push('/login');

            },
            (error) => {

                addToast(`${error.data.Message}`,
                    {
                        appearance: 'error',
                        autoDismiss: true,
                        autoDismissTimeout: 4000
                    });
            }
        );
    }

    return (
        // <div className="c-app c-default-layout flex-row align-items-center">
        <CContainer className="login-container">
            <CRow className="login-row">
                <CCol md="6" className="login-col">
                    <CContainer>
                        <CRow className="align-items-center login-panel">
                            <CCardGroup className="login-left-panel">
                                <CCard className="card-container" style={{ border: '0px', background: '#ebedef' }}>
                                    <CCardBody>
                                        <CForm>
                                            <CImg
                                                fluid
                                                src={"img/logo_conecta.png"}
                                                className="logo-img"
                                            />
                                            <p className="text-center subtitle">Ingrese su codigo de confirmación.</p>

                                            <CInputGroup className="mb-3">
                                                <CInputGroupPrepend>
                                                    <CInputGroupText>
                                                        <CIcon name="cil-envelope-closed" />
                                                    </CInputGroupText>
                                                </CInputGroupPrepend>
                                                <CInput type="text" onChange={handleChange} placeholder="codigo" value={codigo.codigo} id="codigo" style={{ background: 'white', border: '0px' }} />
                                            </CInputGroup>

                                            <CRow className="mb-3">
                                                <CCol xs="12">
                                                    <CButton color="primary" className="px-12" style={{ width: '100%', background: '#7979e7' }} onClick={onSubmit}>Verificar Codigo.</CButton>
                                                </CCol>
                                            </CRow>
                                            <CRow>
                                                <CCol xs="12" className="text-left">
                                                    ¿No te llego el codigo? <CButton color="link" style={{ paddingLeft: '3px' }} onClick={reenviarCodigo}>Reenviar Codigo</CButton>
                                                </CCol>
                                            </CRow>
                                            <CButton color="link" onClick={() => {
                                                reactLocalStorage.remove('user');
                                                history.push('/');
                                            }}>
                                                Cerrar Sesión
                                            </CButton>
                                        </CForm>
                                    </CCardBody>
                                </CCard>
                            </CCardGroup>
                        </CRow>
                    </CContainer>
                </CCol>
                <CCol md="6" className="login-col-right">
                    <CContainer>
                        <CRow className="align-items-center login-card-right">
                            <CCardGroup className="login-right-panel">
                                <CCard className="p-4 card-container-right" style={{ backgroundColor: 'white' }}>
                                    <CRow className="image-card">
                                        <CImg
                                            className="img-card-info"
                                            src="/img/hero/card-info.jpg"
                                        />
                                    </CRow>
                                </CCard>
                            </CCardGroup>
                        </CRow>
                    </CContainer>
                </CCol>
            </CRow>
        </CContainer>
        // </div>
    )
}

export default ConfirmacionUsuario
