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
import { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import { useToasts } from 'react-toast-notifications';
import { reactLocalStorage } from 'reactjs-localstorage';
import { loginUser } from 'src/api/apiHandler';
import axios from 'axios';

const Login = () => {
  const { addToast } = useToasts();
  const history = useHistory();
  const [login, setLogin] = useState({
    username: "",
    password: ""
  });
  const [login_success, setLoginSuccess] = useState(false);
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

  const handleChange = (e) => {
    const { id, value } = e.target;
    const form_object = JSON.parse(JSON.stringify(login));
    let new_data = {
      ...form_object,
      [id]: value
    };
    setLogin(new_data);
  }

  const responseGoogle = (response) => {
    //console.log(response);
  }


  const onSubmit = async (e) => {
    e.preventDefault();
    let error = false;
    let labels = {
      username: "Correo Electrónico",
      password: "Contraseña"
    };

    for (const [key, value] of Object.entries(login)) {
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
    if (!em.test(String(login.username).toLowerCase())) {
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

    let object_login = {
      email: login.username,
      password: login.password,
      remember_me: true
    }

    const dataApi = await loginUser(object_login);

    if (dataApi.valid && !login_success) {

      setLoginSuccess(true)
      let result = dataApi.response;

      reactLocalStorage.setObject('user', {
        'email': login.username,
        'token': result.data.access_token,
        'plan': ''
      });

      addToast(`Login Exitoso`, {
        appearance: 'success',
        autoDismiss: true,
        autoDismissTimeout: 4000
      });

      const config = {
        headers: {
          "Authorization": `Bearer ${result.data.access_token}`
        }
      };



      setLogin({
        username: "",
        password: ""
      });



      axios.get(
        'https://ws.conectaguate.com/api/v1/site/verificado',
        config
      ).then(async (response) => {
        console.log("response", response.data.verificacion);
        if (response.data.verificacion === null) {
          addToast(`Verificacion Necesaria`, {
            appearance: 'warning',
            autoDismiss: true,
            autoDismissTimeout: 4000
          });
          history.push('/ConfirmacionUsuario');
        } else {
          history.push('/creacion-pedido')
        }
      });

    } else {
      let error = dataApi.response;
      if (error.response) {
        addToast(`Usuario o Contraseña incorrectos`, {
          appearance: 'error',
          autoDismiss: true,
          autoDismissTimeout: 4000
        });
      }
    }

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
                        onClick={() => {
                          history.push('/');
                        }}
                      />
                      <p className="text-center subtitle">Iniciar Sesión</p>
                      <CInputGroup className="mb-3">
                        <CInputGroupPrepend>
                          <CInputGroupText>
                            <CIcon name="cil-envelope-closed" />
                          </CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput type="text" id="username" onChange={handleChange} value={login.username} placeholder="Tu correo electrónico" autoComplete="username" style={{ background: 'white', border: '0px' }} />
                      </CInputGroup>
                      <CInputGroup className="mb-1">
                        <CInputGroupPrepend>
                          <CInputGroupText>
                            <CIcon name="cil-lock-locked" />
                          </CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput type="password" id="password" onChange={handleChange} value={login.password} placeholder="Tu contraseña" autoComplete="current-password" style={{ background: 'white', border: '0px' }} />
                      </CInputGroup>
                      <CRow>
                        <CCol xs="12" className="text-left">
                          <CButton color="link" to="/resetPassword">¿Olvidaste tu contraseña?</CButton>
                        </CCol>
                      </CRow>
                      <CRow>
                        <CCol xs="12">
                          <CButton color="primary" className="px-12" style={{ width: '100%', background: '#7979e7' }} onClick={onSubmit}>Continuar</CButton>
                        </CCol>
                      </CRow>
                      {/* Separate */}
                      <CRow style={{
                        width: '100%',
                        borderBottom: '2px solid #153b75',
                        marginBottom: '1rem',
                        marginLeft: 'auto',
                        marginRight: 'auto'
                      }}>
                        &nbsp;
                      </CRow>

                      {/* <CRow>
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
                      <br/>
                      <CRow>
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
                      <CRow>
                        <CCol xs="12" className="text-left">
                          ¿No tienes cuenta? <CButton color="link" style={{ paddingLeft: '3px' }} to="/register">Registrate</CButton>
                        </CCol>
                        <CCol xs="12" className="text-right">
                          <CButton color="link" style={{ paddingLeft: '0px', paddingRight: '0px' }} to="/">Regresar al inicio</CButton>
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

export default Login
