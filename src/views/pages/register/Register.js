import React, { Fragment, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { ToastProvider, useToasts } from 'react-toast-notifications';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import { reactLocalStorage } from 'reactjs-localstorage';
import GoogleLogin from 'react-google-login';


const Register = () => {
  // 619638783948-v4fp9d2b59r0fb7nfi6cpqteja0dai69.apps.googleusercontent.com
  const { addToast } = useToasts();
  const history = useHistory();

  const [register, setRegister] = useState({
    name: "",
    username: "",
    password: ""
  });


  useEffect(() => {
    const user = reactLocalStorage.getObject('user');
    if (Object.keys(user).length > 0) {
      if (user !== 'undefined' && user !== undefined && user !== null) {
        if (user.token.length > 0) {
          history.push('/creacion-pedido');
        }
      }
    }
  }, [])

  const responseGoogle = (response) => {
    //console.log(response);
  }

  const handleChange = (e) => {
    const { id, value } = e.target;
    const form_object = JSON.parse(JSON.stringify(register));
    let new_data = {
      ...form_object,
      [id]: value
    };
    setRegister(new_data);
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

  const onSubmit = () => {
    let error = false;
    let labels = {
      name: "Nombre",
      username: "Correo Electrónico",
      password: "Contraseña"
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

      if (key === 'password' && value.length < 7) {
        addToast(`La ${labels[key]} debe tener 7 caracteres como minimo`, {
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

    // const params = new URLSearchParams();
    // params.append('param1', 'value1');
    // params.append('param2', 'value2');

    let object_register = {
      name: register.name,
      email: register.username,
      password: register.password,
      password_confirmation: register.password
    }

    let object_login = {
      email: register.username,
      password: register.password,
      remember_me: true
    }

    // const params = new URLSearchParams();
    // params.append('name', register.name);
    // params.append('email', register.username);
    // params.append('password', register.password);
    // params.append('password_confirmation', register.password);

    axios({
      method: 'post',
      url: 'https://ws.conectaguate.com/api/auth/signup',
      data: object_register,
    }).then(
      (result) => {
        axios({
          method: 'post',
          url: 'https://ws.conectaguate.com/api/auth/login',
          data: object_login,
        }).then(
          (result) => {
            addToast(`Registro Exitoso`, {
              appearance: 'success',
              autoDismiss: true,
              autoDismissTimeout: 4000
            });
            reactLocalStorage.setObject('user', {
              'name': register.name,
              'email': register.username,
              'token': result.data.access_token
            });

            setRegister({
              name: "",
              username: "",
              password: ""
            })
            reenviarCodigo();
            history.push('/ConfirmacionUsuario');
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {

            //console.log(error.response);

          }
        );
      },
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
      (error) => {
        if (error.response) {
          if (error.response.hasOwnProperty("data")) {
            Object.entries(error.response.data).forEach((elem) => {
              let data = elem[1];
              if (Array.isArray(data)) {
                addToast(data[0],
                  {
                    appearance: 'error',
                    autoDismiss: true,
                    autoDismissTimeout: 4000
                  });
              }
            });
          }
        }
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
                      <p className="text-center subtitle">Selecciona tu método de registro</p>

                      {/* <CRow className="mb-3">
                        <CCol xs="12">
                          <CButton 
                            color="primary" 
                            className="px-12" 
                            style={{
                              width: '100%', 
                              background:'#143B74', 
                              border: '1px solid #143B74',
                              textAlign: 'left'
                            }} 
                            to="/creacion-pedido">
                              <CImg 
                                    className="social-icon-button"
                                    src="/img/icons/facebook.svg"
                                    onClick={()=>{
                                        window.open('https://www.facebook.com/ConectaGuateOficial/', '_blank').focus();
                                    }}
                                />
                              Iniciar Sesión con Facebook
                            </CButton>
                        </CCol>
                      </CRow>
                      <CRow className="mb-3" style={{
                              display: 'block',
                              marginLeft: 'auto',
                              marginRight:'auto',
                              width: '100%'
                            }} 
                          >
                        <CCol 
                          xs="12" 
                          style={{
                              display: 'block',
                              marginLeft: 'auto',
                              marginRight:'auto',
                              position: 'relative'
                            }} 
                          className="login_google"
                          >
                          <GoogleLogin
                            clientId="619638783948-v4fp9d2b59r0fb7nfi6cpqteja0dai69.apps.googleusercontent.com"
                            buttonText="Iniciar Sesión con Google"
                            onSuccess={responseGoogle}
                            onFailure={responseGoogle}
                            cookiePolicy={'single_host_origin'}
                            style={{width: '100%', display:'block'}}
                          />
                        </CCol>
                      </CRow> */}

                      <CInputGroup className="mb-3">
                        <CInputGroupPrepend>
                          <CInputGroupText>
                            <CIcon name="cil-user" />
                          </CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput type="text" onChange={handleChange} placeholder="Tu Nombre" value={register.name} id="name" style={{ background: 'white', border: '0px' }} />
                      </CInputGroup>

                      <CInputGroup className="mb-3">
                        <CInputGroupPrepend>
                          <CInputGroupText>
                            <CIcon name="cil-envelope-closed" />
                          </CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput type="text" onChange={handleChange} placeholder="Tu correo electrónico" value={register.username} id="username" style={{ background: 'white', border: '0px' }} />
                      </CInputGroup>

                      <CInputGroup className="mb-3">
                        <CInputGroupPrepend>
                          <CInputGroupText>
                            <CIcon name="cil-lock-locked" />
                          </CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput type="password" onChange={handleChange} placeholder="Tu contraseña" value={register.password} id="password" style={{ background: 'white', border: '0px' }} />
                      </CInputGroup>
                      <CRow className="mb-3">
                        <CCol xs="12">
                          <CButton color="primary" className="px-12" style={{ width: '100%', background: '#7979e7' }} onClick={onSubmit}>Registrarme gratis</CButton>
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
                          <CButton className="left-button" color="link">Terminos y Condiciones</CButton>y<CButton className="right-button" color="link" >Politicas de privacidad</CButton>
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
