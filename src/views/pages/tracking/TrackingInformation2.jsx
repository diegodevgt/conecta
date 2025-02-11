import React, {
    useEffect,
    useState
} from 'react'
import {
    useHistory,
    useRouteMatch,
    useParams
} from "react-router-dom";
import axios from 'axios';
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CContainer,
    CJumbotron,
    CRow,
    CImg,
    CAlert,
    CInput,
    CLabel
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { useToasts } from 'react-toast-notifications';
import 'core-js/es/array';

import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'
import TrackEvent from './componentes/TrackEvent';
import { isNil } from 'lodash';
import * as icon from '@coreui/icons';

function TrackingInformation(props) {
    const match = useRouteMatch();
    let { id } = useParams();
    const [info, setInfo] = useState(null)
    const [step_classes, setStepClasses] = useState(null)
    const [user, setUser] = useState({});
    const [transportes, setTransportes] = useState(null);
    const [estatus, setEstatus] = useState(null);
    const [tipos_de_pago, setTiposDePago] = useState(null);
    const [data_cross_selling, setDataCrossSelling] = useState([]);
    const { addToast } = useToasts();
    const history = useHistory();

    const isoToDate = (str) => {
        let date_edited = new Date(str);
        let year = date_edited.getFullYear();
        let month = date_edited.getMonth() + 1;
        let dt = date_edited.getDate();

        if (dt < 10) {
            dt = '0' + dt;
        }
        if (month < 10) {
            month = '0' + month;
        }
        date_edited = dt + "-" + month + "-" + year;
        return date_edited
    }

    useEffect(() => {
        axios({
            method: 'get',
            url: `https://ws.conectaguate.com/api/v1/site/cross/${id}`,
            headers: {
                'Content-Type': 'application/json'
            },
        }).then((response_items) => {
            let data_items = response_items.data["Data"];
            let new_array = [];
            data_items.forEach((item) => {
                let data_obj = {};
                if (item.img !== null) {
                    data_obj = {
                        id: item.id,
                        img: item.img ?? item.imagen,
                        link: item.link,
                        title: item.link
                    }
                    new_array.push(data_obj);
                }
            })
            setDataCrossSelling(new_array);
        });
    }, [])


    useEffect(() => {
        let base_url = 'https://ws.conectaguate.com/api'

        let transportes = new Promise((resolve, reject) => axios({ method: 'get', url: base_url + '/v1/site/transportes', }).then((data) => resolve({ key: 'transportes', data: data.data['Data'] }, 'transportes')));
        let estatus = new Promise((resolve, reject) => axios({ method: 'get', url: base_url + '/v1/site/estatus', }).then((data) => resolve({ key: 'estatus', data: data.data['Data'] }, 'estatus')));
        let tipos_de_pago = new Promise((resolve, reject) => axios({ method: 'get', url: base_url + '/v1/site/tipopago', }).then((data) => resolve({ key: 'tipos_de_pago', data: data.data['Data'] }, 'tipos_de_pago')));

        Promise.all([transportes, estatus, tipos_de_pago]).then((values) => {
            values.forEach((elem) => {
                let obj = {};
                switch (elem.key) {
                    case 'transportes':
                        elem.data.forEach((elem) => {
                            obj[elem.id] = elem;
                        })
                        setTransportes(obj);
                        break;
                    case 'estatus':
                        elem.data.forEach((elem) => {
                            obj[elem.id] = elem;
                        })
                        setEstatus(obj);
                        break;
                    case 'tipos_de_pago':
                        elem.data.forEach((elem) => {
                            obj[elem.id] = elem;
                        })
                        setTiposDePago(obj);
                        break;
                    default:
                        ;
                }
            })
        });
    }, []);

    useEffect(() => {
        if (transportes !== null && estatus !== null && tipos_de_pago !== null) {
            const config = {};
            axios.get(`https://ws.conectaguate.com/api/v1/site/pedidio/guia/${id}`, config,).then(
                (result) => {
                    let res = result.data["Data"];
                    let classes = {};
                    if (result.data["Data"]["Pedido"] === null) {
                        addToast('Guia no valida', {
                            appearance: 'error',
                            autoDismiss: true,
                            autoDismissTimeout: 3000
                        });
                        history.push({
                            pathname: `/`,
                        });
                        return false
                    } else {
                        let pedido = res["Pedido"];
                        res["Pedido"].estado_pedido = estatus[res["Pedido"].status].nombre;
                        setInfo({
                            ...pedido,
                            created_at: isoToDate(pedido.created_at),
                            updated_at: isoToDate(pedido.updated_at),
                            tipo_pago: pedido.tipo_pago != null ? tipos_de_pago[pedido.tipo_pago].nombre : "N/A",
                            nombre_tienda: (res["Empresa"]) ? res["Empresa"] : "",
                            multimedia: res["multimedia"]
                        })
                    }

                    if (res["Pedido"].estado_pedido === 'Completada') {
                        classes.step1 = "stepper-item completed"
                        classes.step2 = "stepper-item completed"
                        classes.step3 = "stepper-item completed"
                        classes.step4 = "stepper-item completed"
                        classes.step1_img = "completed"
                        classes.step2_img = "completed"
                        classes.step3_img = "completed"
                        classes.step4_img = "completed"
                    } else if (res["Pedido"].estado_pedido === 'Tránsito') {
                        classes.step1 = "stepper-item completed"
                        classes.step2 = "stepper-item completed"
                        classes.step3 = "stepper-item active"
                        classes.step4 = "stepper-item "
                        classes.step1_img = "completed"
                        classes.step2_img = "completed"
                        classes.step3_img = "active"
                        classes.step4_img = "completed-hold"
                    } else if (res["Pedido"].estado_pedido === 'Almacén') {
                        classes.step1 = "stepper-item completed"
                        classes.step2 = "stepper-item active"
                        classes.step3 = "stepper-item "
                        classes.step4 = "stepper-item "
                        classes.step1_img = "completed"
                        classes.step2_img = "active"
                        classes.step3_img = "completed-hold"
                        classes.step4_img = "completed-hold"
                    } else if (res["Pedido"].estado_pedido === 'Creado') {
                        classes.step1 = "stepper-item active"
                        classes.step2 = "stepper-item "
                        classes.step3 = "stepper-item "
                        classes.step4 = "stepper-item "
                        classes.step1_img = "active"
                        classes.step2_img = "completed-hold"
                        classes.step3_img = "completed-hold"
                        classes.step4_img = "completed-hold"
                    } else if (res["Pedido"].estado_pedido === 'Recibido') {
                        classes.step1 = "stepper-item active"
                        classes.step2 = "stepper-item "
                        classes.step3 = "stepper-item "
                        classes.step4 = "stepper-item "
                        classes.step1_img = "active"
                        classes.step2_img = "completed-hold"
                        classes.step3_img = "completed-hold"
                        classes.step4_img = "completed-hold"
                    } else if (res["Pedido"].estado_pedido === 'Devolución') {
                        classes.step1 = "stepper-item completed"
                        classes.step2 = "stepper-item completed"
                        classes.step3 = "stepper-item active"
                        classes.step4 = "stepper-item "
                        classes.step1_img = "completed"
                        classes.step2_img = "completed"
                        classes.step3_img = "active"
                        classes.step4_img = "completed-hold"
                    } else if (res["Pedido"].estado_pedido === 'Liquidado') {
                        classes.step1 = "stepper-item completed"
                        classes.step2 = "stepper-item completed"
                        classes.step3 = "stepper-item completed"
                        classes.step4 = "stepper-item completed"
                        classes.step1_img = "completed"
                        classes.step2_img = "completed"
                        classes.step3_img = "completed"
                        classes.step4_img = "completed"
                    } else if (res["Pedido"].estado_pedido === 'Cancelado') {
                        classes.step1 = "stepper-item completed"
                        classes.step2 = "stepper-item completed"
                        classes.step3 = "stepper-item completed"
                        classes.step4 = "stepper-item "
                        classes.step1_img = "completed"
                        classes.step2_img = "completed"
                        classes.step3_img = "completed"
                        classes.step4_img = "completed-hold"
                    } else {
                        classes.step1 = "stepper-item "
                        classes.step2 = "stepper-item "
                        classes.step3 = "stepper-item "
                        classes.step4 = "stepper-item "
                        classes.step1_img = "completed-hold"
                        classes.step2_img = "completed-hold"
                        classes.step3_img = "completed-hold"
                        classes.step4_img = "completed-hold"
                    }
                    setStepClasses({ ...classes })


                },
                (error) => {

                    //console.log(error);

                });
        }
    }, [transportes, estatus, tipos_de_pago])

    const info_keys = {
        created_at: 'Fecha',
        updated_at: 'Actualización',
        id: 'Orden',
        guia: 'Guía',
        estado_pedido: 'Estado',
        nombre_destino: 'Destinatario',
        nombre_tienda: 'Tienda',
        telefono_destino: 'Telefono destino',
        tipo_pago: 'Pago',
        tipoDestino: 'Destino'

    }

    const info_keys_full_rows = {
        direccion_destino: 'Direccion de entrega',
        // descripcion_producto: 'Descripción de producto',
        comentarios: 'Comentarios'
    }

    useEffect(() => {
    }, [step_classes])


    return (
        (info) ?
            <>
                <CContainer className="tracking-info pt-5 pb-5">
                    <CRow className="justify-content-md-center mb-3">
                        <CCol>
                            <h1 className="title">
                                Tracking
                            </h1>
                        </CCol>
                        <CCol className="ml-auto text-right">

                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="4" md="6" lg="6">
                            <h1 className="title text-right">
                                No. de Orden: {info.id}
                            </h1>
                            <br />
                            <CContainer>
                                {(!isNil(info.tienda)) && (
                                    <CRow>
                                        <CCol>
                                            <strong>Tienda: </strong> {info.tienda}
                                        </CCol>
                                    </CRow>
                                )}

                                <CRow>
                                    <CCol>
                                        <h4>
                                            <strong className='labelsEntrega'>Destinatario: </strong> {info.nombre_destino}
                                        </h4>
                                    </CCol>
                                </CRow>
                                <CRow>
                                    <CCol>
                                        <h4>
                                            <strong className='labelsEntrega'>Dirección de entrega: </strong> {info.direccion_destino}
                                        </h4>
                                    </CCol>
                                </CRow>
                                <br /><br /><br />
                                <CRow>
                                    <CCol xs={12} sm={12} md={12} lg={12}>
                                        <div class="button-box">
                                            <button class="button2" onClick={() => { window.open(`http://localhost:3000/#/Confirmacion-datos/${info.guia}`) }}>
                                                <p class="titulo">Confirmar <br /> dirección</p>

                                                <img
                                                    src={`img/icons/emojis/astro.png`}

                                                    alt="Hands"
                                                />
                                                <p class="description">de entrega</p>
                                            </button>
                                        </div>
                                    </CCol>
                                    <CCol xs={12} sm={12} md={12} lg={12}>
                                        <div class="button-box">
                                            <button class="button2" onClick={() => { window.open(`https://api.whatsapp.com/send?phone=50242860214&text=Hola%20me%20gustar%C3%ADa%20saber%20en%20donde%20esta%20mi%20paquete,%20esta%20es%20la%20clave%20del%20pedido:%20${id}`) }}>
                                                <p class="titulo">¿Ayuda?</p>

                                                <img
                                                    src={`img/icons/emojis/manos.png`}
                                                    alt="Man"
                                                />
                                                <p class="description">¿Que<br /> necesitas?</p>
                                            </button>
                                        </div>
                                    </CCol>
                                    <CCol xs={12} sm={12} md={12} lg={12}>
                                        <div class="button-box">
                                            <button class="button2" onClick={() => { window.open(`https://api.whatsapp.com/send?phone=50242860214&text=Hola%20me%20gustar%C3%ADa%20saber%20en%20donde%20esta%20mi%20paquete,%20esta%20es%20la%20clave%20del%20pedido:%20${id}`) }}>
                                                <p class="titulo">Seleccionar <br /> entrega</p>

                                                <img
                                                    src={`img/icons/emojis/calendario.gif`}
                                                    alt="Man"
                                                    className='sm'
                                                />
                                                <p class="description">Cambio<br /> fecha</p>
                                            </button>
                                        </div>
                                    </CCol>
                                </CRow>
                            </CContainer>
                        </CCol>
                        <CCol xs="12" sm="8" md="6" lg="6" className='containerTracking'>
                            <CRow className={``}>
                                <CCol className={`d-flex flex-column text-right containerSearch`}>
                                    <CInput type='text' value={info.guia}></CInput>
                                    <small>Ingrese otra orden.</small>
                                </CCol>
                            </CRow>
                            <TrackEvent className='m-auto'></TrackEvent>
                        </CCol>
                    </CRow>
                    <CRow className="justify-content-md-center mb-3"
                        style={{ display: (info.estado_pedido === 'cancelado' || info.estado_pedido === 'devolucion') ? 'flex' : 'none' }}
                    >
                        <CCol sm="12" lg="10">
                            <CAlert className="tracking-info-alert" color="warning">
                                <CIcon
                                    name="cil-warning"
                                    style={{ marginRight: '1rem' }} />
                                Retornado al almacen
                            </CAlert>
                        </CCol>
                    </CRow>
                    <br />
                    <br />
                    <br />
                    <br />
                    {
                        (data_cross_selling.length > 0) ?
                            <CRow className="justify-content-md-center mb-4" >
                                {/* <CCol lg="1"></CCol> */}
                                <CCol className="col-md-auto">
                                    <h4 className="title-related-products">
                                        Tambien te puede interesar
                                    </h4>
                                </CCol>
                                {/* <CCol lg="1"></CCol> */}
                            </CRow>
                            : null
                    }

                    {
                        (data_cross_selling.length > 0) ?
                            <CRow >
                                <CCol style={{ height: '55vh' }}>
                                    <MultipleSlidesExample data={data_cross_selling} />
                                </CCol>
                            </CRow>
                            : null
                    }

                </CContainer >
            </> : null
    )
}

const RowData = (props) => {
    return (
        <CRow className="p-2">
            <CCol>
                <CRow className="ml-4">
                    <h6 className="key-info">{props.info_keys[props.left_data[0]]}: </h6> <h6 className="value-info">{props.data[props.left_data[0]]}</h6>
                </CRow>
            </CCol>
            <CCol>
                <CRow className="ml-4">
                    <h6 className="key-info">{props.info_keys[props.right_data[0]]}: </h6> <h6 className="value-info">{props.data[props.right_data[0]]}</h6>
                </CRow>
            </CCol>
        </CRow>
    )
}


const FullRowData = (props) => {
    return (
        <CRow className="p-2">
            <CCol>
                <CRow className="ml-4">
                    <h6 className="key-info">{props.info_keys[props.data_key]}: </h6> <h6 className="value-info" dangerouslySetInnerHTML={{ __html: props.data[props.data_key].replace(/\n/g, '<br />') }}></h6>
                </CRow>
            </CCol>
        </CRow>
    )
}

const MultipleSlidesExample = (props) => {
    const { data } = props;
    const style = {
        textAlign: 'center',
        padding: '10px 0',
        fontSize: '30px'
    };
    const styleButton = {
        marginTop: 'auto',
        marginBottom: '10px',
        width: 'fit-content',
        marginLeft: 'auto',
        backgroundColor: '#26a2e8',
        border: '#26a2e8',
        fontWeight: '700'
    }
    const properties = {
        duration: 500,
        slidesToShow: (data.length < 3) ? data.length : 3,
        slidesToScroll: 1,
        autoplay: false,
        indicators: true,
        responsive: [
            { breakpoint: 1200, settings: { slidesToShow: (data.length < 3) ? data.length : 3, slidesToScroll: 1 } },
            { breakpoint: 820, settings: { slidesToShow: (data.length < 3) ? data.length : 2, slidesToScroll: 1 } },
            { breakpoint: 0, settings: { slidesToShow: 1, slidesToScroll: 1 } },
        ]
    };

    const openInNewTab = (url) => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }

    const clickProductoConecta = (id) => {
        axios({
            method: 'post',
            url: `https://ws.conectaguate.com/api/v1/click/cross/${id}`,
            headers: {
                'Content-Type': 'application/json'
            },
        });
    }

    return (
        <div>
            <div>
                <Slide {...properties}>
                    {data.map((item, index) => {
                        const img_context = item.img.includes('ws.conectaguate')
                            ? item.img
                            : `https://ws.conectaguate.com/${item.img}`;
                        return <div style={style} key={`div_carrousel_${index}`}>
                            <CCard style={{
                                backgroundImage: `url("${img_context}")`,
                            }}
                                key={`data_slide_${index}`}
                                className="cross-selling-image"
                                onClick={(e) => {
                                    e.preventDefault();
                                    clickProductoConecta(item.id)
                                    openInNewTab(item.link)
                                }}
                            >
                                <CButton className="btn btn-primary" style={styleButton}>ver más</CButton>
                            </CCard>
                        </div>
                    })}
                </Slide>
            </div>
        </div>
    );
};


export default TrackingInformation

