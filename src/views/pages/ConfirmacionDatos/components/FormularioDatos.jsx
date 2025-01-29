import { CForm, CButton, CInput, CLabel, CRow, CCol, CContainer, CCard, CCardBody } from "@coreui/react";
import {
    useParams
} from "react-router-dom";
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { isNil, isNull } from "lodash";
import './Formulario.css';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import { useToasts } from "react-toast-notifications";

const FormularioDatos = () => {
    const { addToast } = useToasts();
    const center = {
        lat: 14.6349, // Coordenadas iniciales (Ciudad de Guatemala)
        lng: -90.5069,
    };
    const [markerPosition, setMarkerPosition] = useState(center);
    const [currentLocation, setCurrentLocation] = useState(center);
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyBwiSMa99895DByja7JhVNx2tnC4z5hTxo", // Reemplaza con tu clave API
    });

    const containerStyle = {
        width: '100%',
        height: '400px',
    };


    let { id } = useParams();
    let [nuevaDireccion, setNuevaDireccion] = useState(0);
    let [configuracion, setConfiguracion] = useState({
        direccionPedido: null,
        direcciones: [],
        telefono: null
    });
    let [formularioLleno, setFormularioLleno] = useState(false);

    let [direccionSeleccionada, setDireccionSeleccionada] = useState({
        telefono: null,
        cambioDireccion: null,
        destinatario: null,
        direccion: null,
        latitud: null,
        longitud: null,
        guia: null,
        id: null
    });

    const onMapClick = useCallback((event) => {
        setMarkerPosition({
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
        });
        setDireccionSeleccionada((prevState) => ({
            ...prevState,
            latitud: event.latLng.lat(),
            longitud: event.latLng.lng()
        }))
    }, []);

    useEffect(() => {
        obtenerConfiguracionActual();
        setDireccionSeleccionada((prevState) => ({
            ...prevState,
            guia: id
        }));
    }, [id]);

    useEffect(() => {
        cambioDeConfiguracion();
    }, [configuracion]);

    useEffect(() => {
        if (nuevaDireccion === 1) {
            setDireccionSeleccionada((prevState) => ({
                ...prevState,
                id: null,
                direccion: ""
            }));
        }
    }, [nuevaDireccion])

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCurrentLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error('Error al obtener la ubicación:', error);
                }
            );
        } else {
            console.error('Geolocalización no soportada por el navegador');
        }
    }, []);

    const cambioDeConfiguracion = () => {
        //Asignacion de valores o validacion en configuracion.
        if (isNil(configuracion)) {
            return;
        }

        setDireccionSeleccionada((prevState) => ({
            ...prevState,
            telefono: configuracion.telefono
        }));
    }

    const obtenerConfiguracionActual = () => {
        let formData = new FormData();
        formData.append("guia", id);

        axios.post(
            'http://127.0.0.1:8000/api/v1/confirmacion/direccion',
            formData
        ).then(async (response) => {
            setConfiguracion(response.data.Data);
            setFormularioLleno(!isNull(response?.data?.Registro));
        }).catch((e) => {
            console.log(e);
        });
    }

    const handleChange = (e) => {
        const { name, value } = e.target; // Desestructurar nombre y valor del input
        setDireccionSeleccionada({
            ...direccionSeleccionada, // Mantener los valores anteriores
            [name]: value, // Actualizar el valor del campo actual
        });
    };

    const cambioDireccion = (valor) => {
        setDireccionSeleccionada({
            ...direccionSeleccionada,
            'cambioDireccion': valor,
            direccion: valor === 'no' ? configuracion.direccionPedido : '',
        });

    }

    const seleccionDireccion = (e) => {
        const { name, value } = e.target;
        if (isNil(value) || value == "" || value == null) {
            return;
        }
        const direccion = configuracion.direcciones.find(d => d.id == value);
        setDireccionSeleccionada((prevState) => ({
            ...prevState,
            id: direccion.id,
            latitud: direccion.latitud,
            longitud: direccion.longitud,
            direccion: direccion.direccion
        }));
    }

    const enviarFormulario = () => {
        if (!formularioValido()) {
            return;
        }
        const formData = direccionSeleccionada;
        axios.put(
            'http://127.0.0.1:8000/api/v1/confirmacion/direccion',
            formData
        ).then(async (response) => {
            addToast('Se confirmo la informacion correctamente.', {
                appearance: 'success',
                autoDismiss: true,
                autoDismissTimeout: 3000
            });
            obtenerConfiguracionActual();
        }).catch((e) => {
            console.log(e);
            addToast('No se pudo guardar tu confirmación de dirección.',{
                appearance: 'error',
                autoDismiss: true,
                autoDismiss: 9000
            })
        });
    }

    const formularioValido = () => {
        const form = direccionSeleccionada;
        let valido = true;
        if (nuevaDireccion == 1) {
            if (isNil(form.direccion)) {
                addToast('Ingrese una dirección.', {
                    appearance: 'warning',
                    autoDismiss: true,
                    autoDismissTimeout: 3000
                });
                valido = false;
            }
            if (isNil(form.latitud) || isNil(form.longitud)) {
                addToast('Ingrese su ubicación de entrega.', {
                    appearance: 'warning',
                    autoDismiss: true,
                    autoDismissTimeout: 3000
                });
                valido = false;
            }
        } else {
            if(direccionSeleccionada.cambioDireccion == 'si' && configuracion.direcciones.length > 0){
                if (isNil(form.id)) {
                    addToast('Seleccione una dirección.', {
                        appearance: 'warning',
                        autoDismiss: true,
                        autoDismissTimeout: 3000
                    });
                    valido = false;
                }
            }
            if(direccionSeleccionada.cambioDireccion == 'si' && configuracion.direcciones.length === 0){
                if (isNil(form.direccion)) {
                    addToast('Ingrese una dirección.', {
                        appearance: 'warning',
                        autoDismiss: true,
                        autoDismissTimeout: 3000
                    });
                    valido = false;
                }
            }
            if(isNil(form.longitud)){
                addToast('Seleccione su ubicación.', {
                    appearance: 'warning',
                    autoDismiss: true,
                    autoDismissTimeout: 3000
                });
                valido = false;
            }
        }
        return valido;
    }

    return (
        <>
            <CContainer className={'fitContante'}>
                <CRow>
                    <CCol xs={10} md={10} lg={8} className={'m-auto'}>
                        <CCard style={{ marginTop: '5vh', marginBottom: '5vh' }}>
                            <CCardBody>
                                {(!formularioLleno) && (

                                    <CForm>
                                        <CRow>
                                            <CCol xs={12} md={12} lg={12}>
                                                <h2 className="text-center">¡Gracias por realizar tu pedido!</h2>
                                                <p>Queremos ofrecerte un buen servicio y nos ayudarías mucho confirmando tus datos de entrega.</p>
                                            </CCol>
                                        </CRow>
                                        <CRow>
                                            <CCol xs={12} md={12} lg={12}>
                                                <CLabel>
                                                    Dirección de entrega:
                                                    <br></br>
                                                    <strong>
                                                    <u>{configuracion.direccionPedido}</u>
                                                    </strong>
                                                    <br />
                                                    <br />
                                                    <strong>¿Es correcta la dirección de entrega?</strong>
                                                </CLabel>
                                                <CRow>
                                                    <CCol xs={12} md={12} lg={12}>
                                                        <CButton color="primary" variant="outline" className={`btnLeft ${direccionSeleccionada.cambioDireccion === 'no' ? 'active' : ''}`} onClick={() => cambioDireccion('no')}>Si</CButton>
                                                        <CButton color="secondary" variant="outline" className={`btnRight ${direccionSeleccionada.cambioDireccion === 'si' ? 'active' : ''}`} onClick={() => cambioDireccion('si')}>No</CButton>
                                                    </CCol>
                                                </CRow>
                                            </CCol>
                                        </CRow>
                                        {(direccionSeleccionada.cambioDireccion === 'si' && configuracion.direcciones.length > 0) && (
                                            <CRow className={'mt-3'}>
                                                <CCol xs={8} md={9} lg={9}>
                                                    <CLabel htmlFor="direccionSelect"><strong>Selecciona una dirección:</strong></CLabel>
                                                    <select className="form-control" size="lg" id="direccionSelect" name="direccionSelect" value={direccionSeleccionada.id} onChange={seleccionDireccion} disabled={nuevaDireccion === 1}>
                                                        <option value={null}>Selecciona una dirección</option>
                                                        {configuracion.direcciones.map((opcion) => (
                                                            <option key={opcion.id} value={opcion.id}>
                                                                {opcion.direccion}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </CCol>
                                                <CCol xs={4} md={3} lg={3} className={'d-flex'}>
                                                    {(nuevaDireccion === 0) && (
                                                        <CButton className={'mt-auto ml-auto'} color="primary" variant="outline" onClick={() => { setNuevaDireccion(1) }}>Nuevo</CButton>
                                                    )}
                                                    {(nuevaDireccion === 1) && (
                                                        <CButton className={'mt-auto ml-auto'} color="danger" variant="outline" onClick={() => { setNuevaDireccion(0) }}>Cancelar</CButton>
                                                    )}
                                                </CCol>
                                            </CRow>
                                        )}
                                        {(nuevaDireccion === 1 || (direccionSeleccionada.cambioDireccion === 'si' && configuracion.direcciones.length === 0)) && (
                                            <CRow className={'mt-3'}>
                                                <CCol xs={12} md={12} lg={12} className={'mt-3'}>
                                                    <CLabel htmlFor="direccion"><strong>Nueva dirección de entrega:</strong></CLabel>
                                                    <CInput type="text" id="direccion" name="direccion" value={direccionSeleccionada.direccion} onChange={handleChange} placeholder="Nueva dirección de entrega." />
                                                </CCol>
                                            </CRow>
                                        )}
                                        {((direccionSeleccionada.cambioDireccion === 'si' && configuracion.direcciones.length === 0) || nuevaDireccion === 1 || direccionSeleccionada.cambioDireccion === 'no') && (
                                            <CRow className={'mt-3'}>
                                                <CCol xs={12} md={12} lg={12} className={'mt-3'}>
                                                    <CLabel><strong>Selecciona tu ubicación:</strong></CLabel>
                                                    <GoogleMap
                                                        mapContainerStyle={containerStyle}
                                                        center={markerPosition}
                                                        zoom={12}
                                                        onClick={onMapClick}
                                                    >
                                                        {/* Marker para la ubicación seleccionada */}
                                                        <Marker position={markerPosition} />
                                                    </GoogleMap>
                                                </CCol>
                                            </CRow>
                                        )}
                                        <CRow>
                                            <CCol xs={12} md={12} lg={12} className={'text-right'}>
                                                <CButton type="button" className={'mt-3 ml-auto'} color="primary" onClick={() => { enviarFormulario() }}>
                                                    Guardar
                                                </CButton>
                                            </CCol>
                                        </CRow>
                                    </CForm>
                                )}
                                {(formularioLleno) && (
                                    <CRow>
                                        <CCol xs={12} md={12} lg={12}>
                                            <h2 className="text-center">Gracias por realizar tu pedido</h2>
                                            <p className="text-center">¡Ya tenemos tu información de entrega, gracias por el apoyo!</p>
                                        </CCol>
                                    </CRow>
                                )}
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
            </CContainer>
        </>
    )
}

export default FormularioDatos;