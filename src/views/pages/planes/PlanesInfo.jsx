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
        free: '<strong>Free:</strong> Envía tus paquetes a toda Guatemala con el mejor servicio profesional en paquetería. <br><br><ul><li>Atención personalizada.</li><li>Tracking de entrega.</li><li>Control de tus envíos.</li><li>Guías personalizadas.</li></ul><br><strong>Tarifas por envío:</strong><br>Ciudad Q25.00 <br>Aledaños Q35.00 <br>Interior (todo destino) Q45.00 + 4% fee por pago contra entrega.<br><br>',
        pro: '<strong>Pro:</strong> Al contar con la Suscripción PRO obtienes los siguientes beneficios:<br><ul><li>Atención personalizada.</li><li>Tracking de entrega.</li><li>Control de tus envíos. </li><li>Guías personalizadas.</li><li>Incluye 5 envíos en zonas aledañas o ciudad.</li><li>Activación de Cross Selling.</li><li>3 devoluciones. </li></ul><br><strong>Tarifas por envío:</strong><br>Ciudad Q25.00<br>Aledaños Q30.00<br>Interior (todo destino) Q35.00 + 4% fee por pago contra entrega.<br>',
        premium: '<strong>Premium:</strong> Conecta tu negocio a toda Guatemala con las mejores tarifas y beneficios que te ofrecemos: <br> <ul><li>Atención personalizada.</li><li>Tracking de entrega.</li><li>Control de tus envíos. </li><li>Guías personalizadas.</li><li>Incluye 25 envíos en zonas aledañas o ciudad.</li><li>Activación de Cross Selling.</li><li>5 devoluciones. </li></ul><br><strong>Tarifas por envío: </strong><br>Ciudad Q20.00 <br>Aledaños Q20.00 <br>Interior (todo destino) Q30.00 + 4% fee por pago contra entrega. <br>'
    })


    const [planPrice, setPlanrice] = useState({
        free: 'Q 0.00',
        pro: 'Q 150.00',
        premium: 'Q 299.00',
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
            reactLocalStorage.remove('user');
            history.push('/login');
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
            reactLocalStorage.remove('user');
            history.push('/login');
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
                                    <div className='align-items-center description' dangerouslySetInnerHTML={{ __html: props.description }}>

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

