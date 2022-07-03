import React, { lazy, Fragment, useState, useEffect, useRef} from 'react'
import axios from 'axios'
import {
    CButton,
    CCol,
    CRow,
    CFormGroup,
    CLabel,
    CInput,
  } from '@coreui/react'
  import { useToasts } from 'react-toast-notifications';
  import {reactLocalStorage} from 'reactjs-localstorage';

function NewPassword(props) {
    const { addToast } = useToasts();
    const [form, setForm] = useState({
        current_password: "",
        new_password: "",
        new_confirm_password: "",
    });

    const handleChangeForm = (e) =>{
        const {id, value} = e.target;
        const form_object = JSON.parse(JSON.stringify(form));
        let new_form = {
            ...form_object,
            [id]: value
        };
        setForm(new_form);
    }

    const onSubmit = () =>{
        const user_object = reactLocalStorage.getObject('user');
        console.log(`Bearer ${user_object.token}`);
        let error = false;
        let labels = {
            current_password: "Contraseña Actual",
            new_password: "Nueva Contraseña",
            new_confirm_password: "Confirmar Nueva Contraseña",
        };

        for (const [key, value] of Object.entries(form)) {
            if(value.length === 0){
                addToast(`El campo ${labels[key]} es requerido`, { 
                    appearance: 'error', 
                    autoDismiss : true ,
                    autoDismissTimeout : 4000
                });
                error = true;
            }
        }

        if(form.new_password !== form.new_confirm_password){
            addToast(`Las contraseñas no coinciden`, { 
                appearance: 'error', 
                autoDismiss : true ,
                autoDismissTimeout : 4000
            });
            error = true;
        }


        if(!error){
            axios({
                method: 'post',
                url: 'https://ws.conectaguate.com/api/v1/site/usuario/resetpassword',
                data: form,
                headers: { 
                    'Authorization': `Bearer ${user_object.token}`,
                    'Content-Type': 'application/json'
                },
              }).then(
                (result) => {
                  console.log(result);
                    addToast(`Tu contraseña ha sido actualizada`, { 
                        appearance: 'success', 
                        autoDismiss : true ,
                        autoDismissTimeout : 4000
                    });
                    setTimeout(function(){ 
                        setForm({
                            current_password: "",
                            new_password: "",
                            new_confirm_password: "",
                        });
                    }, 1000);
                },
                (error) => {
                  if (error.response) {
                    console.log(error.response);
                    addToast(`La contraseña debe contener 8 caracteres`, { 
                        appearance: 'error', 
                        autoDismiss : true ,
                        autoDismissTimeout : 4000
                    });
                    setTimeout(function(){ 
                        setForm({
                            current_password: "",
                            new_password: "",
                            new_confirm_password: "",
                        });
                    }, 1000);
                  }
                }
              );
        }
    }

    return (
        <>  
            <div className="profile-container">
                <CRow>
                    <CCol sm="12">
                        <div className="profile-title">
                            <h2>Cambio de contraseña</h2>
                        </div>
                    </CCol>
                </CRow>
                <CRow>
                    <CCol sm="12">
                        <CFormGroup>
                            <CLabel htmlFor="current_password">Contraseña Actual</CLabel>
                            <CInput onChange={handleChangeForm} value={form.current_password} id="current_password" type="password" placeholder="" required />
                        </CFormGroup>
                    </CCol>
                </CRow>
                <CRow>
                    <CCol sm="12">
                        <CFormGroup>
                            <CLabel htmlFor="new_password">Nueva Contraseña</CLabel>
                            <CInput onChange={handleChangeForm} value={form.new_password} id="new_password" type="password" placeholder="" required />
                        </CFormGroup>
                    </CCol>
                </CRow>
                <CRow>
                    <CCol sm="12">
                        <CFormGroup>
                            <CLabel htmlFor="new_confirm_password">Confirmar Nueva Contraseña</CLabel>
                            <CInput onChange={handleChangeForm} value={form.new_confirm_password} id="new_confirm_password" type="password" placeholder="" required />
                        </CFormGroup>
                    </CCol>
                </CRow>
                <CRow>
                    <CCol sm="6">
                        
                    </CCol>
                    <CCol sm="6">
                        <CRow>
                            <CCol sm="6" className="mb-3 mb-xl-0">
                                <CButton name="cancelar" block color="secondary">Cancelar</CButton>
                            </CCol>
                            <CCol sm="6" className="mb-3 mb-xl-0">
                                <CButton 
                                onClick={onSubmit}
                                name="guardar" block color="info">Actualizar</CButton>
                            </CCol>
                        </CRow>
                    </CCol>
                </CRow>
            </div>
        </>
    )
}


export default NewPassword

