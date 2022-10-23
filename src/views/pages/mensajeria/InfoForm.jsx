import React, { useState } from 'react'
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
import axios from 'axios'

function InfoForm(props) {
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        empresa: '',
        fecha_entrega: '',
        paquetes: ''
    });
    const { addToast } = useToasts();

    const handleChangeForm = (e) => {
        const { id, value } = e.target;
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
            name: "Nombre",
            email: "Correo Electrónico",
            phone: "Teléfono",
            empresa: "Empresa",
            fecha_entrega: "Fecha de Entrega",
            paquetes: "Paquetes"
        };

        for (const [key, value] of Object.entries(form)) {
            if (value.length === 0) {
                addToast(`El campo ${labels[key]} es requerido`, {
                    appearance: 'error',
                    autoDismiss: true,
                    autoDismissTimeout: 4000
                });
                error = true;
            }
            if (key === "email") {
                const em = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (!em.test(String(value).toLowerCase())) {
                    addToast(`El Correo Electrónico no es valido`, {
                        appearance: 'error',
                        autoDismiss: true,
                        autoDismissTimeout: 4000
                    });
                    error = true;
                }
            }
            if (key === "phone") {
                const te = /^[-\s\.]?[0-9]{4}[-\s\.]?[0-9]{4}$/im;
                if (!te.test(String(value).toLowerCase())) {
                    addToast(`El Numero Telefonico no es valido`, {
                        appearance: 'error',
                        autoDismiss: true,
                        autoDismissTimeout: 4000
                    });
                    error = true;
                }
            }
        }

        let object_send = {
            nombre: form.name,
            correo: form.email,
            producto: form.empresa,
            telefono: form.phone,
            mensaje: `${form.fecha_entrega} ${form.paquetes}`
        }

        if (!error) {
            axios({
                method: 'post',
                url: 'https://ws.conectaguate.com/api/v1/contacto/new',
                data: object_send,
                headers: {
                    'Content-Type': 'application/json'
                },
            }).then(
                (result) => {

                    addToast(`Pronto nos comunicaremos contigo`, {
                        appearance: 'success',
                        autoDismiss: true,
                        autoDismissTimeout: 4000
                    });
                    setTimeout(function () {
                        setForm({
                            name: '',
                            email: '',
                            phone: '',
                            empresa: '',
                            fecha_entrega: '',
                            paquetes: ''
                        });
                    }, 1000);
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    if (error.response) {
                        addToast(`Hubo un error intentelo mas tarde`, {
                            appearance: 'error',
                            autoDismiss: true,
                            autoDismissTimeout: 4000
                        });
                        setTimeout(function () {
                            setForm({
                                name: '',
                                email: '',
                                phone: '',
                                empresa: '',
                                fecha_entrega: '',
                                paquetes: ''
                            });
                        }, 1000);
                    }
                }
            );
        }

    }

    return (
        <>
            <CContainer className="mt-5 info-form">
                <CRow>
                    <CCol>
                        <h2 className="title">
                            Mensajeria Corporativa
                        </h2>
                    </CCol>
                </CRow>
                <CRow className="mt-5 form">
                    <CCol sm="6">
                        <CRow className="">
                            <p className="d-inline-flex copy">
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                                when an unknown printer took a galley of type and scrambled it to make a type
                                specimen book.
                            </p>

                        </CRow>
                        <br />
                        <ItemList text="Reporteria" />
                        <ItemList text="Prueba de entrega (P.O.D.)" />
                        <ItemList text="Seguro en tránsito" />
                        <ItemList text="Atención personalizada" />
                        <br />
                        <br />
                    </CCol>
                    <CCol sm="6">
                        <CCard className="form-card">
                            <CCardBody>
                                <br />
                                <CFormGroup>
                                    <CInput value={form.name} id="name" type="text" onChange={handleChangeForm} placeholder="Nombre y Apellido" required />
                                </CFormGroup>
                                <CFormGroup>
                                    <CInput value={form.email} id="email" type="email" onChange={handleChangeForm} placeholder="Correo electrónico" required />
                                </CFormGroup>
                                <CFormGroup>
                                    <CInput value={form.phone} id="phone" type="tel" onChange={handleChangeForm} placeholder="Teléfono: 0000-0000" pattern="[0-9]{4}-[0-9]{4}" required />
                                </CFormGroup>
                                <CFormGroup>
                                    <CInput value={form.empresa} id="empresa" type="text" onChange={handleChangeForm} placeholder="Empresa*" required />
                                </CFormGroup>
                                <CFormGroup>
                                    <CInput value={form.fecha_entrega} id="fecha_entrega" type="text" onChange={handleChangeForm} placeholder="Fecha de entrega*" />
                                </CFormGroup>
                                <CFormGroup>
                                    <CInput value={form.paquetes} id="paquetes" type="text" onChange={handleChangeForm} placeholder="Cantidad de paquetes*" />
                                </CFormGroup>

                                <CFormGroup className="form-actions" style={{ marginBottom: '0' }}>
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

function ItemList(props) {
    return (
        <>
            <CRow className="item_list" style={{ marginLeft: '2rem' }}>
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

