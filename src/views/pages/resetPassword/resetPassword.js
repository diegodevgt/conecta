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
import { useState } from 'react';
import { useHistory } from "react-router-dom";
import { useToasts } from 'react-toast-notifications';


const Register = () => {
  const { addToast } = useToasts();
  const history = useHistory();

  const [register, setRegister] = useState({
    username: ""
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    const form_object = JSON.parse(JSON.stringify(register));
    let new_data = {
      ...form_object,
      [id]: value
    };
    setRegister(new_data);
  }

  const onSubmit = () => {
    let error = false;
    let labels = {
      username: "Correo Electrónico"
    };

    for (const [key, value] of Object.entries(register)) {
      if (value.length === 0) {
        addToast(`El campo ${labels[key]} es requerido`, {
          appearance: 'error',
          autoDismiss: true,
          autoDismissTimeout: 4000
        });
        error = true;
      }
    }


    const em = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!em.test(String(register.username).toLowerCase())) {
      addToast(`El Correo Electrónico no es valido`, {
        appearance: 'error',
        autoDismiss: true,
        autoDismissTimeout: 4000
      });
      error = true;
    }

    if (error) {
      return false;
    }

    let object_register = {
      email: register.username
    }

    axios({
      method: 'post',
      url: 'https://ws.conectaguate.com/api/v1/site/lostpassword',
      data: object_register,
    }).then(
      (result) => {
        addToast('Se envio el correo de Recuperación.', {
          appearance: 'success',
          autoDismiss: true,
          autoDismissTimeout: 4000
        });
        setTimeout(() => {
          history.push('/login');
        }, 4000);
      },
      (error) => {
        addToast(error.response.data.Message || 'No se pudo enviar el correo',
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
                      <p className="text-center subtitle">Complete los campos para enviarle el correo de recuperacion.</p>

                      <CInputGroup className="mb-3">
                        <CInputGroupPrepend>
                          <CInputGroupText>
                            <CIcon name="cil-envelope-closed" />
                          </CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput type="text" onChange={handleChange} placeholder="Tu correo electrónico" value={register.username} id="username" style={{ background: 'white', border: '0px' }} />
                      </CInputGroup>

                      <CRow className="mb-3">
                        <CCol xs="12">
                          <CButton color="primary" className="px-12" style={{ width: '100%', background: '#7979e7' }} onClick={onSubmit}>Enviar Correo de Recuperación.</CButton>
                        </CCol>
                      </CRow>
                      <CRow>
                        <CCol xs="12" className="text-left">
                          ¿Ya usas Conecta Guate? <CButton color="link" style={{ paddingLeft: '3px' }} to="/login">Iniciar sesión</CButton>
                        </CCol>
                      </CRow>
                      <CRow>
                        <CCol xs="12" className="text-center">
                          Al continuar aceptas nuestros
                        </CCol>
                        <CCol xs="12" className="text-center">
                          <CButton className="left-button" color="link" onClick={() => {
                            window.open('https://conectaguate.com/legales/terminso_condiciones_conecta22.pdf', '_blank').focus();
                          }}>Terminos y Condiciones</CButton>
                        </CCol>
                      </CRow>
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

export default Register
