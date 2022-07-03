import React, {useState} from 'react'
import PropTypes from 'prop-types'
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CContainer,
    CJumbotron,
    CRow,
    CEmbed,
    CEmbedItem,
    CInput,
    CInputGroup,
    CInputGroupText,
    CInputGroupPrepend,
    CInputGroupAppend,
    CFormGroup,
    CLabel,
    CTextarea,
    CImg
  } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { useToasts } from 'react-toast-notifications';

function InfoForm(props) {
    const { addToast } = useToasts();
    const [form, setForm] = useState({
        name: '',
        edad: '',
        email: '',
        phone: '',
        plaza: '',
        message: ''
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

    const onSubmit = () => {
        let error = false;
        let labels = {
            name: 'Nombre y Apellido',
            edad: 'Edad',
            email: 'Correo Electrónico',
            phone: 'Teléfono',
            plaza: 'Plaza'
        };

        for (const [key, value] of Object.entries(form)) {
            if(value.length === 0 && key !== 'message'){
                addToast(`El campo ${labels[key]} es requerido`, { 
                    appearance: 'error', 
                    autoDismiss : true ,
                    autoDismissTimeout : 4000
                });
                error = true;
            }
            if(key === "email"){
                const em = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if(!em.test(String(value).toLowerCase())){
                    addToast(`El Correo Electrónico no es valido`, { 
                        appearance: 'error', 
                        autoDismiss : true ,
                        autoDismissTimeout : 4000
                    });
                    error = true;
                }
            }
            if(key === "phone"){
                const te = /^[-\s\.]?[0-9]{4}[-\s\.]?[0-9]{4}$/im;
                if(!te.test(String(value).toLowerCase())){
                    addToast(`El Numero Telefonico no es valido`, { 
                        appearance: 'error', 
                        autoDismiss : true ,
                        autoDismissTimeout : 4000
                    });
                    error = true;
                }
            }
        }

        console.log(error);
        return error;
    }

    return (
        <>
            <CContainer className="mt-5 info-bolsa-form">
                <CRow>
                    <CCol>
                        <h2 className="title">
                            Bolsa de empleo
                        </h2>
                    </CCol>
                </CRow>
                <CRow>
                    <CCol>
                        <h2 className="subtitle">
                            Sé parte de nuestro equipo en las oficinas centrales y ayúdanos a Conectar Guate de forma fácil, rápida y segura.
                        </h2>
                    </CCol>
                </CRow>
                <CRow className="form">
                    <CCol sm="4">
                        <CRow className="">
                            <h3 className="title_available">
                                Vacantes disponibles
                            </h3>
                        </CRow>
                        <br/>
                        <CRow className="">
                            <h3 className="subtitle_left">
                                Vacantes Ciudad Capital
                            </h3>
                        </CRow>
                        <br/>
                        <CRow className="">
                            <p className="d-inline-flex copy">
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                                when an unknown printer took a galley of type and scrambled it to make a type 
                                specimen book. 
                            </p>
                            <p className="d-inline-flex copy">
                                Disponible hasta: <p className="until"> 01/11/2021 </p>
                            </p>
                        </CRow>
                        <CRow className="separator">	&nbsp; </CRow>
                        <br/>
                        <CRow className="">
                            <h3 className="subtitle_left">
                                Mensajeria motorista
                            </h3>
                        </CRow>
                        <br/>
                        <CRow className="">
                            <p className="d-inline-flex copy">
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
                                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                                when an unknown printer took a galley of type and scrambled it to make a type 
                                specimen book. 
                            </p>
                            <p className="d-inline-flex copy">
                                Disponible hasta: <p className="until"> 15/10/2021 </p>
                            </p>
                        </CRow>
                        <br/>
                    </CCol>
                    <CCol sm="8">
                        <CCard className="form-card">
                            <CCardBody>
                                <br/>
                                <CFormGroup>
                                    <CInput value={form.name} id="name" type="text" onChange={handleChangeForm} placeholder="Nombre y Apellido" required/>
                                </CFormGroup>
                                <CFormGroup>
                                    <CInput value={form.edad} id="edad" type="text" onChange={handleChangeForm} placeholder="Edad*" required/>
                                </CFormGroup>
                                <CFormGroup>
                                    <CInput value={form.email} id="email" type="email" onChange={handleChangeForm} placeholder="Correo electrónico" required/>
                                </CFormGroup>
                                <CFormGroup>
                                    <CInput value={form.phone} id="phone" type="tel" onChange={handleChangeForm} placeholder="Teléfono: 0000-0000" pattern="[0-9]{4}-[0-9]{4}" required/>
                                </CFormGroup>
                                <CFormGroup>
                                    <CInput value={form.plaza} id="plaza" type="text" onChange={handleChangeForm} placeholder="Plaza a la que aplicas*" required/>
                                </CFormGroup>
                                <CFormGroup>
                                    <CTextarea 
                                        name="message" 
                                        id="message" 
                                        rows="4"
                                        placeholder="¿Por qué te gustaría trabajar con nosotros?" 
                                        value={form.message}
                                        onChange={handleChangeForm}
                                    />
                                </CFormGroup>

                                <CFormGroup className="form-actions" style={{marginBottom: '0'}}>
                                    <CRow className="justify-content-md-center item-buttons">
                                        <CCol className="col-md-auto">
                                            <CButton className="button" type="submit" size="lg" color="secondary" onClick={onSubmit}>Conectar</CButton>
                                        </CCol>
                                    </CRow>
                                </CFormGroup>

                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
            </CContainer>
        </>
    )
}

function ItemList(props){
    return(
        <>
            <CRow className="item_list" style={{marginLeft:'2rem'}}>
                <CIcon 
                    name="cil-check" 
                    style={{
                        marginRight: '1rem',
                        color: '#46b9ef'
                    }} />
                {props.text}
            </CRow>
        </>
    )

}


InfoForm.propTypes = {

}

export default InfoForm

