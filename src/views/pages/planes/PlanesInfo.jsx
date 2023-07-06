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
            description: 'Al contar con la Suscripción PRO obtienes los siguientes beneficios:',
            listado: [
                'Atención personalizada.',
                'Tracking de entrega.',
                'Control de tus envíos.',
                'Guías personalizadas.',
                'Incluye 5 envíos en zonas aledañas o ciudad.',
                'Activación de Cross Selling.',
                '3 devoluciones.'
            ],
            tarifas: [
                'Q25.00 Ciudad.',
                'Q30.00 Aledaños.',
                'Q35.00 Interior todo destino (4% fee por pago contra entrega).'
            ]
        },
        premium: {
            description: 'Conecta tu negocio a toda Guatemala con las mejores tarifas y beneficios que te ofrecemos:',
            listado: [
                'Atención personalizada.',
                'Tracking de entrega.',
                'Control de tus envíos.',
                'Guías personalizadas.',
                'Incluye 25 envíos en zonas aledañas o ciudad.',
                'Activación de Cross Selling.',
                '5 devoluciones.'
            ],
            tarifas: [
                'Q20.00 Ciudad.',
                'Q25.00 Aledaños.',
                'Q32.00 Interior todo destino (4% fee por pago contra entrega).'
            ]
        }
    })

    const [descripciones, setDescripcion] = useState({
        description: '',
        listado: []
    })


    const [planPrice, setPlanrice] = useState({
        free: 'Q 0.00',
        pro: 'Q 150.00',
        premium: 'Q 500.00',
    })

    const [planSelected, setPlanSelected] = useState({
        free: false,
        pro: false,
        premium: false
    });

    const history = useHistory();
    const { addToast } = useToasts();

    useEffect(() => {

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
            switch (response.data.Plan) {
                case "Premium":
                    setPlanSelected({
                        free: false,
                        pro: false,
                        premium: true
                    });
                    break;
                case "Pro":
                    setPlanSelected({
                        free: false,
                        pro: true,
                        premium: false
                    });
                    break;
                case "Free":
                    setPlanSelected({
                        free: true,
                        pro: false,
                        premium: false
                    });
                    break;
                case "Startup":
                    setPlanSelected({
                        free: false,
                        pro: false,
                        premium: false
                    });
                    break;
            }
        });
    }, []);

    const solicitudCambioPlan = async (planId) => {
        const user_object = reactLocalStorage.getObject('user');

        let bearer = "";
        if (user_object === 'undefined' || user_object === undefined || user_object === null || Object.keys(user_object).length === 0) {
            switch (planId) {
                case 2:
                    window.open('https://app.recurrente.com/s/conecta-guate/suscripcion-pro', '_blank', 'noopener,noreferrer');
                    break;
                case 3:
                    window.open('https://app.recurrente.com/s/conecta-guate/suscripcion-premium', '_blank', 'noopener,noreferrer');
                    break;
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
            switch (planId) {
                case 2:
                    window.open('https://app.recurrente.com/s/conecta-guate/suscripcion-pro', '_blank', 'noopener,noreferrer');
                    break;
                case 3:
                    window.open('https://app.recurrente.com/s/conecta-guate/suscripcion-premium', '_blank', 'noopener,noreferrer');
                    break;
            }

        }, (error) => {
            addToast(`Intente mas tarde`, {
                appearance: 'error',
                autoDismiss: true,
                autoDismissTimeout: 4000
            });
        });

    }

    const onChangePlan = (name) => {
        let plans;
        switch (name) {
            case 'free':
                plans = {
                    free: true,
                    pro: false,
                    premium: false
                }
                solicitudCambioPlan(1);
                break;
            case 'pro':
                plans = {
                    free: false,
                    pro: true,
                    premium: false
                }
                solicitudCambioPlan(2);
                break;
            case 'premium':
                plans = {
                    free: false,
                    pro: false,
                    premium: true
                }
                solicitudCambioPlan(3);
                break;
            default:
                plans = {
                    free: false,
                    pro: false,
                    premium: false
                }
        }
    }

    return (
        <>
            <CContainer className="planes-info">
                {/* <CRow className="planes-title">
                    <CCol>
                        Cambiar plan
                    </CCol>
                </CRow> */}
                <br />
                <CardPlan
                    img={images.free}
                    subtitle={"Free"}
                    description={plan.free}
                    active={planSelected.free}
                    changePlan={onChangePlan}
                    plan={"free"}
                    price={planPrice.free}
                    actual={planSelected}
                />
                <br />
                <CardPlan
                    img={images.pro}
                    subtitle={"Pro"}
                    description={plan.pro}
                    active={planSelected.pro}
                    changePlan={onChangePlan}
                    plan={"pro"}
                    price={planPrice.pro}
                    actual={planSelected}
                />
                <br />
                <CardPlan
                    img={images.premium}
                    subtitle={"Premium"}
                    description={plan.premium}
                    active={planSelected.premium}
                    changePlan={onChangePlan}
                    plan={"premium"}
                    recommended={true}
                    price={planPrice.premium}
                    actual={planSelected}
                />
                <br />
            </CContainer>
        </>
    )
}

function Dots(props) {
    const color = props.color === 'azul' || props.color === undefined ? '#63a0e3' : '#329a3b';
    return (
        <>
            <svg color={color} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle" viewBox="0 0 16 16" >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" />
            </svg>
        </>
    )
}


function DescriptionPlan(props) {
    const descripcion = props.descripcion
    const descripciones = descripcion.listado;
    const tarifas = descripcion.tarifas;
    const listadoDescripcion = descripciones.map((desc) => <li><Dots color="azul" /> {desc} </li>);
    const listadoTarifas = tarifas.map((desc) => <li><Dots color="verde" /> {desc} </li>);
    return (
        <>
            <CRow className="descripcion-title" >
                <b>{descripcion.description}</b>
            </CRow>
            <CRow className="descripcion-listado">
                <ul className="listado-ul" style={{ listStyleType: "none", paddingLeft: "3px" }} >
                    {listadoDescripcion}
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
            <CRow className="recomendado-label" style={{ display: (props.recommended) ? 'block' : 'none' }}> Recomendado </CRow>
            <CRow className="actual-plan" style={{ display: (props.active) ? 'block' : 'none' }}><CCol> Plan Actual</CCol> </CRow>
            <CRow className={props.recommended ? "plan-card plan-card-recommended" : "plan-card"}>
                <CCol>
                    <CCard className="plan-inner-card">
                        <CCardBody>
                            <CRow className="align-items-center">
                                <CCol sm="3">
                                    <CRow>
                                        <CImg
                                            src={props.img}
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
                                        {props.subtitle}
                                    </CRow>
                                </CCol>
                                <CCol sm="9">
                                    <div className='align-items-center description'>
                                        <DescriptionPlan descripcion={props.description} />
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
                                                        {props.price}
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
                                                    style={{ display: (props.active) ? 'none' : 'block' }}
                                                    onClick={() => {
                                                        props.changePlan(props.plan)
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
                                <legend style={{ fontSize: '1em' }}>*Tarifa aplica por paquete</legend>
                            </CRow>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </>
    )
}

PlanesInfo.propTypes = {

}

export default PlanesInfo

