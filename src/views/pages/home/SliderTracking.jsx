import {
    CButton,
    CCard,
    CCardBody, CCol,
    CContainer, CFormGroup, CInput,
    CInputGroup, CInputGroupAppend, CInputGroupText, CJumbotron,
    CRow, CTextarea
} from '@coreui/react'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { isNil } from 'lodash'
import Radium, { StyleRoot } from 'radium'
import { useEffect, useState } from 'react'
import { bounceInLeft } from 'react-animations'
import { useHistory } from "react-router-dom"
import { useToasts } from 'react-toast-notifications'
function SliderTracking(props) {

    const [form, setForm] = useState({
        name: "",
        email: "",
        product: "",
        phone: "",
        message: ""
    });
    const history = useHistory();


    const [guia, setGuia] = useState("")
    const [telefono, setTelefono] = useState(null)
    const { addToast } = useToasts();

    useEffect(() => {
        setGuia("");
        setForm({
            name: "",
            email: "",
            product: "",
            phone: "",
            message: ""
        });
    }, [])

    // useEffect(()=>{
    //     console.log(form);
    // },[form])



    const handleChange = (e) => {
        const { name, value } = e.target;
        setGuia(value);
    }

    const handleChangeForm = (e) => {
        const { id, value } = e.target;
        const form_object = JSON.parse(JSON.stringify(form));
        let new_form = {
            ...form_object,
            [id]: value
        };
        setForm(new_form);
    }

    const searchGuia = async () => {
        if(isNil(guia) || isNil(telefono)){
            addToast('Ingrese el numero de orden y el teléfono.', { appearance: 'warning', autoDismiss: true, autoDismissTimeout: 3000});
            return;
        }
        let guiaTrim = guia.trim();
        let telefonoTrim = telefono.trim();
        let guia_existe = await getGuiaInfo(guiaTrim, telefonoTrim);
        if (guia_existe) {
            addToast('Guia Encontrada', {
                appearance: 'info',
                autoDismiss: true,
                autoDismissTimeout: 3000
            });
            history.push({
                pathname: `/tracking/${guiaTrim}/telefono/${telefonoTrim}`,
                state: { orden: guiaTrim, telefono: telefonoTrim }
            });
        } else {
            addToast("Guia no valida", {
                appearance: 'error',
                autoDismiss: true,
                autoDismissTimeout: 3000
            });
        }
    }

    const getGuiaInfo = async (orderId, telefono) => {
        const config = {};
        const orderIdBase64 = btoa(orderId);
        const telefonoBase64 = btoa(telefono);
        try {
            const result = await axios.get(`https://ws.conectaguate.com/api/v1/pedido/guia/${orderIdBase64}/telefono/${telefonoBase64}`, config);
            return result.data["Data"]["Pedido"] !== null;
        } catch (error) {
            //console.log(error.message);
            return false;
        }
    }

    const onSubmit = (e) => {
        e.preventDefault();
        let error = false;
        let labels = {
            name: "Nombre",
            email: "Correo Electrónico",
            product: "Producto",
            phone: "Teléfono",
            message: "Mensaje"
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
            producto: form.product,
            telefono: form.phone,
            mensaje: form.message
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
                            name: "",
                            email: "",
                            product: "",
                            phone: "",
                            message: ""
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
                                name: "",
                                email: "",
                                product: "",
                                phone: "",
                                message: ""
                            });
                        }, 1000);
                    }
                }
            );


        }
    }

    const styles = {
        bounceInLeft: {
            animation: 'x 1s',
            animationName: Radium.keyframes(bounceInLeft, 'bounceInLeft')
        }
    }

    return (
        <>
            <CRow className="home-slider">
                <CCol lg="8" className="col-slider">
                    <CCard className="home-slider-card">
                        {/* <CCardBody> */}
                        <CJumbotron
                            className="border home-slider-background"
                        // style={{paddingTop:'10rem'}}
                        >
                            <CContainer className="home-slider-container">
                                <CRow className="align-items-end row-tracking">

                                    <CCol lg="5" className="align-self-end">
                                        <StyleRoot>
                                            <h1 className="display-3 title" style={styles.bounceInLeft}>
                                                ¿Dónde está <br />
                                                mi paquete?
                                            </h1>
                                        </StyleRoot>
                                    </CCol>
                                    <CCol lg="7" className="align-self-end search-input">
                                        <CInputGroup className="mb-1 input-tracker">
                                            <CInput
                                                value={guia}
                                                name="guia"
                                                type="text"
                                                placeholder="#Orden"
                                                className="busqueda-tracking-input"
                                                onChange={handleChange}
                                            />
                                            <CInput
                                                value={telefono}
                                                name="telefono"
                                                type="number"
                                                placeholder="#Teléfono"
                                                className="busqueda-tracking-input"
                                                onChange={(e) => setTelefono(e.target.value)}
                                            />
                                            
                                            <CInputGroupAppend
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    searchGuia();
                                                }}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <CInputGroupText style={{
                                                    backgroundColor: "#153b75",
                                                    border: "#153b75"
                                                }}>
                                                    <FontAwesomeIcon
                                                        icon={faSearch}
                                                        style={{ marginRight: '.3rem', color: 'white'}}
                                                        size="lg"
                                                    />
                                                </CInputGroupText>
                                            </CInputGroupAppend>
                                        </CInputGroup>
                                    </CCol>
                                </CRow>
                            </CContainer>
                        </CJumbotron>
                    </CCard>
                </CCol>
                <CCol lg="4" className="col-form">
                    <CCard className="home-form">
                        <CCardBody >
                            <CRow className="justify-content-md-center">
                                <CCol>
                                    <h3
                                        className="title"
                                    >Quiero Conectarme:</h3>
                                </CCol>
                            </CRow>
                            {/* <form> */}
                            <CFormGroup>
                                <CInput value={form.name} id="name" type="text" onChange={handleChangeForm} placeholder="Nombre Completo" required />
                            </CFormGroup>
                            <CFormGroup>
                                <CInput value={form.email} id="email" type="email" onChange={handleChangeForm} placeholder="Correo electrónico" required />
                            </CFormGroup>
                            <CFormGroup>
                                <CInput value={form.product} id="product" onChange={handleChangeForm} placeholder="Tu producto: ej. ropa, comida, etc" required />
                            </CFormGroup>
                            <CFormGroup>
                                <CInput value={form.phone} id="phone" type="tel" onChange={handleChangeForm} placeholder="Teléfono: 0000-0000" pattern="[0-9]{4}-[0-9]{4}" required />
                            </CFormGroup>
                            <CFormGroup>
                                <CTextarea
                                    name="message"
                                    id="message"
                                    rows="4"
                                    placeholder="Escribe tu mensaje"
                                    value={form.message}
                                    onChange={handleChangeForm}
                                />
                            </CFormGroup>
                            <CFormGroup className="form-actions" style={{ marginBottom: '0' }}>
                                <CRow className="justify-content-md-center item-buttons">
                                    <CCol className="col-md-auto">
                                        <CButton className="button" type="submit" size="lg" color="secondary" onClick={
                                            onSubmit
                                        }>Conectar</CButton>
                                    </CCol>
                                </CRow>
                            </CFormGroup>
                            {/* </form> */}
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </>
    )
}

export default SliderTracking

