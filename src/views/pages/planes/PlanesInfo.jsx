import {
    CButton,
    CCard,
    CCardBody, CCol,
    CContainer, CImg, CRow
} from '@coreui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import {
    useHistory
} from "react-router-dom";
import { useToasts } from 'react-toast-notifications';
import { reactLocalStorage } from 'reactjs-localstorage';

function PlanesInfo(props) {
    const [images, setImages] = useState({
        free: 'img/icons/planes/mundo.svg',
        pro: 'img/icons/planes/estrella.svg',
        premium: 'img/icons/planes/diamante.svg'
    })

    const [contenido, setContenido] = useState([]);
    const [planActualId, setPlanActualId] = useState([]);
    let contenidoData = {
        id: null,
        nombre: null,
        contenido: {
            id: null,
            planId: null,
            nombre: null,
            descripcion: null,
            precio: null,
            linkPago: null,
            linkPublico: null,
            icono: null,
            created_at: null,
            updated_at: null,
            detalles:
                [{
                    id: null,
                    contentId: null,
                    descripcion: null,
                    created_at: null,
                    updated_at: null,
                }],
            tarifas: [
                {
                    id: null,
                    contentId: null,
                    descripcion: null,
                    precio: null,
                    created_at: null,
                    updated_at: null
                }
            ]
        },
        costo: null,
        pedidos: null,
        duracion: null,
        status: null,
        updated_at: null,
        created_at: null,
        cross_selling: null,
        flgPublico: null,
    };

    const [plan, setPlan] = useState({
        free: {
            description: 'Envía tus paquetes a toda Guatemala con el mejor servicio profesional en paquetería.',
            listado: [
                'Tracking de entrega.',
                'Control de tus envíos.',
                'Guías personalizadas.'
            ],
            tarifas: [
                'Q25.00 Ciudad.',
                'Q35.00 Aledaños.',
                'Q45.00 Interior todo destino (4% fee por pago contra entrega).'
            ]
        },
        pro: {
            description: 'Realiza envíos como un Profesional y disfruta de estos beneficios:',
            listado: [
                'Atención personalizada.',
                'Tracking de entrega.',
                'Control de tus envíos.',
                'Guías personalizadas.',
                'Incluye 10 envíos al interior todo destino.',
                'Activación de Cross Selling.',
                '3 devoluciones.'
            ],
            tarifas: [
                'Q25.00 Ciudad.',
                'Q30.00 Aledaños.',
                'Q35.00 Interior todo destino (4% fee por pago contra entrega).'
            ],
            leyenda: "*Tarifa aplica por paquete, hasta 15 lbs"

        },
        premium: {
            description: 'Conecta tu negocio a toda Guatemala y posiciona tu marca:',
            listado: [
                'Atención personalizada.',
                'Tracking de entrega.',
                'Control de tus envíos.',
                'Guías personalizadas.',
                'Incluye 15 envíos departamentales.',
                'Activación de Cross Selling.',
                'Sin coste por devoluciones.',
                'Catálogo en línea'
            ],
            tarifas: [
                'Q20.00 Ciudad.',
                'Q25.00 Aledaños.',
                'Q32.00 Interior todo destino ( +4% fee por pago contra entrega).'
            ],
            leyenda: "*Tarifa aplica por paquete, hasta 15 lbs"
        }
    })

    const [descripciones, setDescripcion] = useState({
        description: '',
        listado: []
    })


    const [planPrice, setPlanrice] = useState({
        free: 'Q 0.00',
        pro: 'Q 350.00',
        premium: 'Q 750.00',
    })

    const [planSelected, setPlanSelected] = useState({
        free: false,
        pro: false,
        premium: false
    });

    const history = useHistory();
    const { addToast } = useToasts();

    useEffect(async () => {
        await cargarPlanes();
        await obtenerPlanActual();
    }, []);

    const cargarPlanes = async () => {
        axios.get(
            'https://ws.conectaguate.com/api/v1/planes/contenido'
        ).then(async (response) => {
            //Plan Response Data Plan
            const planesPublicos = response.data.Data.planes;
            setContenido(planesPublicos);
        });
    }

    const obtenerPlanActual = async () => {
        const user_object = reactLocalStorage.getObject('user');
        if (user_object === 'undefined' || user_object === undefined || user_object === null || Object.keys(user_object).length === 0) {
            setPlanSelected({
                free: true,
                pro: false,
                premium: false
            });
            return;
        }

        const config = {
            headers: {
                "Authorization": `Bearer ${user_object.token}`
            }
        };

        axios.get(
            'https://ws.conectaguate.com/api/v1/site/planactual',
            config
        ).then(async (response) => {
            //Plan Response Data Plan
            const planId = response.data.PlanActual.id;
            setPlanActualId(planId);
        });
    }

    const solicitudCambioPlan = async (planId) => {
        const user_object = reactLocalStorage.getObject('user');
        const planSolicitud = contenido.find(plan => plan.id === planId);
        let bearer = "";
        if (user_object === 'undefined' || user_object === undefined || user_object === null || Object.keys(user_object).length === 0) {
            if (planSolicitud.contenido.linkPublico != null && planSolicitud.contenido.linkPublico != undefined && planSolicitud.contenido.linkPublico != "") {
                window.open(planSolicitud.contenido.linkPublico, '_blank', 'noopener,noreferrer');
            }
            return;
        } else {
            bearer = `Bearer ${user_object.token}`;
        }

        await axios({
            method: 'post',
            url: `https://ws.conectaguate.com/api/v1/site/suscripcion/cambioplan/${planId}`,
            headers: {
                'Authorization': bearer,
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            addToast(`Solicitud De Cambio de Plan Enviada`, {
                appearance: 'success',
                autoDismiss: true,
                autoDismissTimeout: 4000
            });
            if (planSolicitud.contenido.linkPago != null && planSolicitud.contenido.linkPago != undefined && planSolicitud.contenido.linkPago != "") {
                window.open(planSolicitud.contenido.linkPago, '_blank', 'noopener,noreferrer');
            }

        }, (error) => {
            addToast(`Intente mas tarde`, {
                appearance: 'error',
                autoDismiss: true,
                autoDismissTimeout: 4000
            });
        });

    }

    const onChangePlan = (id) => {
        solicitudCambioPlan(id);
    }

    return (
        <>
            <br />
            <CContainer className="planes-info">
                {
                    contenido.map(data => {
                        return (

                            <CardPlan
                                contenido={data}
                                changePlan={onChangePlan}
                                planActualId={planActualId}
                            />
                        )
                    })
                }
            </CContainer>
        </>
    )
}

function Dots(props) {
    const color = props.color === 'azul' || props.color === undefined ? '#63a0e3' : '#329a3b';
    return (
        <>
            <svg color={color} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-circle" viewBox="0 0 16 16" >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" />
            </svg>
        </>
    )
}


function DescriptionPlan(props) {
    const descripcion = props.descripcion || "";
    const incluye = props?.incluye || [];
    const tarifas = props.tarifas || [];
    const listadoIncluye = incluye.map((desc) => <li><Dots color="azul" /> {desc.descripcion}. </li>);
    const listadoTarifas = tarifas.map((desc) => <li><Dots color="verde" /> Q{desc.precio} {desc.descripcion}. </li>);
    return (
        <>
            <CRow className="descripcion-title" >
                <b>{descripcion.description}</b>
            </CRow>
            <CRow className="descripcion-listado">
                <ul className="listado-ul" style={{ listStyleType: "none", paddingLeft: "3px" }} >
                    {listadoIncluye}
                </ul>
            </CRow>
            <CRow className="tarifas">
                <strong>Tarifas:</strong>
            </CRow>
            <CRow className="listadoTarifas">
                <ul className="listado-tarifas" style={{ listStyleType: "none", paddingLeft: "3px" }}>
                    {listadoTarifas}
                </ul>
            </CRow>
        </>
    )
}

function CardPlan(props) {
    return (
        <>
            <CRow className="recomendado-label" style={{ display: (props?.contenido?.id == 3) ? 'block' : 'none' }}> Recomendado </CRow>
            <CRow className="actual-plan" style={{ display: (props?.contenido?.id === props.planActualId) ? 'block' : 'none' }}><CCol> Plan Actual</CCol> </CRow>
            <CRow className={props?.contenido?.id == 3 ? "plan-card plan-card-recommended" : "plan-card"}>
                <CCol>
                    <CCard className="plan-inner-card">
                        <CCardBody>
                            <CRow className="align-items-center">
                                <CCol sm="3">
                                    <CRow>
                                        <CImg
                                            src={`https://ws.conectaguate.com/planes/contenido/${props?.contenido?.contenido?.icono}`}
                                            className="diamond-button"
                                            style={{
                                                width: '200px',
                                                display: 'block',
                                                marginLeft: 'auto',
                                                marginRight: 'auto'
                                            }}
                                        />
                                    </CRow>
                                    <CRow className="subtitle-icon">
                                        {props?.contenido?.contenido?.nombre}
                                    </CRow>
                                </CCol>
                                <CCol sm="9">
                                    <div className='align-items-center description'>
                                        <DescriptionPlan descripcion={props?.contenido?.contenido?.descripcion} tarifas={props?.contenido?.contenido?.tarifas} incluye={props?.contenido?.contenido?.detalles} />
                                    </div>
                                </CCol>
                            </CRow>
                            <CRow className="align-items-end">
                                <CCol sm="3">
                                </CCol>
                                <CCol sm="9">
                                    <CRow>
                                        <CCol sm="6">
                                            <CRow className="left">
                                                <CCol>
                                                    <span className="price">
                                                        Q{props?.contenido?.contenido?.precio}
                                                    </span><br />
                                                    <span className="month">
                                                        /mes
                                                    </span>
                                                </CCol>
                                            </CRow>
                                        </CCol>
                                        <CCol sm="6">
                                            <CRow style={{ float: 'right' }}>
                                                <CButton
                                                    className="button-plan"
                                                    color="secondary"
                                                    style={{ display: (props?.contenido?.id === props.planActualId) ? 'none' : 'block' }}
                                                    onClick={() => {
                                                        props.changePlan(props?.contenido?.id)
                                                    }}
                                                >
                                                    Seleccionar
                                                </CButton>
                                            </CRow>
                                        </CCol>
                                    </CRow>
                                </CCol>
                            </CRow>
                            <CRow className="descripcionTarifas" style={{ width: '100%', textAlign: 'center' }}>
                                <legend style={{ fontSize: '1em' }}>{props?.contenido?.contenido?.leyenda !== null ? props?.contenido?.contenido?.leyenda : "*Tarifa aplica por paquete"}</legend>
                            </CRow>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
            <br />
        </>
    )
}

PlanesInfo.propTypes = {

}

export default PlanesInfo

