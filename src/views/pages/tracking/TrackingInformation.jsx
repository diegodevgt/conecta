import React, {
    useEffect,
    useState
} from 'react'
import {
    useParams
} from "react-router-dom";
import axios from 'axios';
import {
    CButton,
    CCard,
    CCardHeader,
    CCardBody,
    CCol,
    CContainer,
    CRow,
    CAlert,
    CInput,
    CLabel,
    CModalFooter,
    CSelect
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { useToasts } from 'react-toast-notifications';
import 'core-js/es/array';

import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'
import TrackEvent from './componentes/TrackEvent';
import { isNil } from 'lodash';
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CModal, CModalBody, CModalHeader } from '@coreui/react';

import es from "date-fns/locale/es"; // Importa el locale en español

registerLocale("es", es);

function TrackingInformation() {
    let { telefono, orden } = useParams();
    const [ordenId, setOrdenId] = useState(null);
    const [info, setInfo] = useState(null); //Este se usa para la informacion del pedido.
    const [data_cross_selling, setDataCrossSelling] = useState([]);
    const { addToast } = useToasts();
    const [parametrosBusqueda, setParametrosBusqueda] = useState({
        telefono: null,
        ordenId: null
    });
    const [showComments, setShowComments] = useState(false);

    const [selectedDate, setSelectedDate] = useState(null);
    const [horario, setHorario] = useState("Matutino");
    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);

    useEffect(() => {
        if (ordenId == null) {
            return;
        }
        axios({
            method: 'get',
            url: `https://ws.conectaguate.com/api/v1/site/cross/${ordenId}`,
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
    }, [ordenId])


    useEffect(() => {
        const config = {};
        setParametrosBusqueda({ telefono: telefono, ordenId: orden });
        const encodedOrden = btoa(orden);
        const encodedTelefono = btoa(telefono);
        axios.get(`https://ws.conectaguate.com/api/v1/pedido/guia/${encodedOrden}/telefono/${encodedTelefono}`, config,).then(
            (result) => {
                let res = result.data["Data"];
                setInfo(res);
                setOrdenId(res.pedido.id);
                addToast("Se encontro la orden.", { appearance: 'success', autoDismiss: true, autoDismissTime: 300 })
            }).catch((error) => {
                addToast("No se encontro la orden.", { appearance: 'warning', autoDismiss: true, autoDismissTime: 300 });
            });
    }, [telefono, orden])

    const buscarNuevaGuia = () => {
        const { telefono, ordenId } = parametrosBusqueda;
        if (telefono && ordenId) {
            const encodedOrden = btoa(ordenId);
            const encodedTelefono = btoa(telefono);
            axios.get(`https://ws.conectaguate.com/api/v1/pedido/guia/${encodedOrden}/telefono/${encodedTelefono}`)
                .then((result) => {
                    let res = result.data["Data"];
                    setInfo(res);
                    setOrdenId(res.pedido.id);
                    addToast("Se encontro la orden.", { appearance: 'success', autoDismiss: true, autoDismissTime: 300 })
                })
                .catch((error) => {
                    addToast("No se encontro la orden.", { appearance: 'warning', autoDismiss: true, autoDismissTime: 300 });
                });
        } else {
            addToast("Ingrese el teléfono y numero de orden.", { appearance: 'warning' });
        }
    }

    const solicitarCambioFecha = () => {

        if (isNil(selectedDate)) {
            addToast("Por favor, seleccione una fecha antes de solicitar el cambio.", { appearance: 'warning', autoDismiss: true, autoDismissTime: 300 });
            return;
        }

        if (isNil(horario)) {
            addToast("Por favor, seleccione un horario de entrega.", { appearance: 'warning', autoDismiss: true, autoDismissTime: 300 });
            return;
        }

        const body = {
            fecha: selectedDate,
            horario: horario,
            pedidoId: ordenId
        }

        const url = 'https://ws.conectaguate.com/api/v1/pedido/solicitudcambio';

        axios.post(url, body, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            addToast("Cambio de fecha solicitado exitosamente.", { appearance: 'success', autoDismiss: true, autoDismissTime: 300 });
            toggle();
        }).catch((error) => {
            addToast("Error al solicitar el cambio de fecha.", { appearance: 'error', autoDismiss: true, autoDismissTime: 300 });
        });
    }

    const convertirFecha = (fecha) => {
        if (isNil(fecha)) {
            return '';
        }
        let fechaEntrega = new Date(fecha);
        let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return fechaEntrega.toLocaleDateString('es-ES', options);
    }

    return (
        (info) ?
            <>
                <CContainer className="tracking-info pt-5 pb-5">
                    <CRow className="justify-content-md-center text-center mb-3">
                        <CCol xs="12" sm="12" md="12" lg="12">
                            <h1 className="title">
                                Tracking
                            </h1>
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="12" md="12" lg="12">
                            <CCard className={"card-container-tracking"}>
                                <CCardBody>
                                    <CRow>
                                        <CCol xs="12" sm="12" md="6" lg="6">
                                            <CRow className={`text-right d-flex flex-row justify-content-end contenedorBusquedaGuia`}>
                                                <CCol xs="12" sm="12" md="12" lg="6">
                                                    <CLabel className={`mb-0 text-left busqueda-tracking`} htmlFor="ordenId">No. de orden</CLabel>
                                                    <CInput
                                                        type="text"
                                                        id="ordenId"
                                                        placeholder='No. de orden'
                                                        value={parametrosBusqueda.ordenId}
                                                        className="busqueda-tracking-input"
                                                        onChange={(e) => setParametrosBusqueda({ ...parametrosBusqueda, ordenId: e.target.value })}
                                                    />
                                                </CCol>
                                                <CCol xs="12" sm="12" md="12" lg="6">
                                                    <CLabel className={`mb-0 text-left busqueda-tracking`} htmlFor="ordenId">Teléfono</CLabel>
                                                    <div className='d-flex justify-content-end'>
                                                        <CInput
                                                            type="text"
                                                            id="telefono"
                                                            value={parametrosBusqueda.telefono}
                                                            className="busqueda-tracking-input"
                                                            placeholder='Numero teléfono destinatario'
                                                            onChange={(e) => setParametrosBusqueda({ ...parametrosBusqueda, telefono: e.target.value })}
                                                        />
                                                        <CButton color="primary" className={`btn-busqueda`} onClick={buscarNuevaGuia}>
                                                            <CIcon name="cil-magnifying-glass" size='auto' className='icono-search' />
                                                        </CButton>
                                                    </div>
                                                </CCol>
                                            </CRow>
                                        </CCol>
                                        <CCol xs="12" sm="12" md="6" lg="6" className={"d-flex flex-column text-center"}>
                                            <p className='titulo-info-guia'>Guía: <span>{info?.pedido?.guia}</span></p>
                                        </CCol>
                                        <CCol xs="12" sm="12" md="6" lg="6">
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
                                                        <p className='fecha-tracking'>Fecha pedido <span>{convertirFecha(info?.pedido?.created_at)}</span></p>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="direccionEntrega">
                                                    <CCol xs={4} sm={4} md={2} lg={2} className={"d-flex flex-column justify-content-center"}>
                                                        <img
                                                            src="img/icons/tracking-icons/user.png"
                                                            alt="Usuario"
                                                            className="icono-informacion-tracking"
                                                        />
                                                    </CCol>
                                                    <CCol xs={8} sm={8} md={10} lg={10}>
                                                        <CLabel className={"label-informacion-tracking"}>Destinatario</CLabel>
                                                        <p className='informacion-tracking'>{info?.pedido?.nombre_destino}</p>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="tienda">
                                                    <CCol xs={4} sm={4} md={2} lg={2} className={"d-flex flex-column justify-content-start"}>
                                                        <img
                                                            src="img/icons/tracking-icons/store.png"
                                                            alt="Tienda"
                                                            className="icono-informacion-tracking"
                                                        />
                                                    </CCol>
                                                    <CCol xs={8} sm={8} md={10} lg={10}>
                                                        <CLabel className={"label-informacion-tracking"}>Tienda</CLabel>
                                                        <p className='informacion-tracking'>{info?.pedido?.empresa}</p>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="pago">
                                                    <CCol xs={4} sm={4} md={2} lg={2} className={"d-flex flex-column justify-content-start"}>
                                                        <img
                                                            src="img/icons/tracking-icons/money.png"
                                                            alt="Dinero"
                                                            className="icono-informacion-tracking"
                                                        />
                                                    </CCol>
                                                    <CCol xs={8} sm={8} md={10} lg={10}>
                                                        <CLabel className={"label-informacion-tracking"}>Pago contra entrega</CLabel>
                                                        <p className='informacion-tracking'>Q{info?.pedido?.COD}</p>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="direccionEntrega">
                                                    <CCol xs={4} sm={4} md={2} lg={2} className={"d-flex flex-column justify-content-start"}>
                                                        <img
                                                            src="img/icons/tracking-icons/paper.png"
                                                            alt="Entrega"
                                                            className="icono-informacion-tracking"
                                                        />
                                                    </CCol>
                                                    <CCol xs={8} sm={8} md={10} lg={10}>
                                                        <CLabel className={"label-informacion-tracking"}>Dirección de entrega</CLabel>
                                                        <p className='informacion-tracking'>{info?.pedido?.direccion_destino}</p>
                                                    </CCol>
                                                </CRow>
                                                <CRow className="confirmarDireccion">
                                                    {isNil(info?.direccionConfirmada) &&
                                                        <CCol xs={12} sm={12} md={12} lg={12} className={"text-center d-flex flex-column"}>
                                                            <CButton className={"btn-confirmar-direccion"} onClick={() => { window.open(`http://localhost:3000/#/Confirmacion-datos/${info.pedido.guia}`) }}>Confirmar dirección</CButton>
                                                        </CCol>
                                                    }
                                                    {!isNil(info?.direccionConfirmada) &&
                                                        <CCol xs={12} sm={12} md={12} lg={12} className={"text-center d-flex flex-column"}>
                                                            <p className='fecha-tracking'>
                                                                Dirección confirmada: <br /> <strong>{info?.direccionConfirmada}</strong>
                                                            </p>
                                                        </CCol>
                                                    }

                                                </CRow>
                                                <CRow className="reprogramar-entrega">
                                                    {isNil(info?.fechaConfirmacion) &&

                                                        <CCol xs={12} sm={12} md={12} lg={12} className={"text-center d-flex flex-column"}>
                                                            <CButton className={"btn-reprogramar-entrega"} onClick={toggle}>¿Reprogramar entrega?</CButton>
                                                            <p style={{ maxWidth: '75%', margin: 'auto', marginTop: '10px', fontSize: '.9em' }}>
                                                                Si no puedes recibir tu paquete el día o dirección programado, cambia tus datos en esta opción.
                                                            </p>
                                                        </CCol>
                                                    }
                                                    {!isNil(info?.fechaConfirmacion) &&

                                                        <CCol xs={12} sm={12} md={12} lg={12} className={"text-center d-flex flex-column"}>
                                                            <p className='fecha-tracking'>
                                                                Fecha confirmación de entrega: <br /> <strong>{info?.fechaConfirmacion} {!isNil(info?.horario) && <span>entrega {info?.horario}</span>}</strong>
                                                            </p>
                                                        </CCol>
                                                    }
                                                </CRow>
                                                <CRow>
                                                    <CCol xs={12} sm={12} md={12} lg={12}>
                                                        <CModal show={modal} onClose={toggle}>
                                                            <CModalHeader closeButton><h4>Solicitar fecha de entrega</h4></CModalHeader>
                                                            <CModalBody>
                                                                <CCol colSpan={12}>

                                                                    <p>Seleccione la fecha de entrega que necesita. Solo se habilitarán los días disponibles.</p>
                                                                    <CRow className={"w-100"}>
                                                                        <div className="form-group w-75">
                                                                            <label htmlFor="fechaEntrega" className='mb-0'>Fecha</label>
                                                                            <DatePicker
                                                                                selected={selectedDate}
                                                                                onChange={handleDateChange}
                                                                                minDate={new Date(new Date().setDate(new Date().getDate() + 1))}
                                                                                maxDate={new Date(new Date().setDate(new Date().getDate() + 7))}
                                                                                placeholderText="Seleccionar fecha de entrega"
                                                                                className="form-control w-100"
                                                                                id="fechaEntrega"
                                                                                locale="es"
                                                                                name="fechaEntrega"
                                                                                filterDate={(date) => date.getDay() !== 0}
                                                                            />
                                                                        </div>
                                                                        <div className="form-group w-25">
                                                                            <label htmlFor="horario" className='mb-0'>Horario Entrega</label>
                                                                            <CSelect
                                                                                id="horario"
                                                                                value={horario}
                                                                                onChange={(e) => setHorario(e.target.value)}
                                                                            >
                                                                                <option value="Matutina">Mañana de 8:00 AM - 12:00 PM</option>
                                                                                <option value="Vespertina">Tarde de 12:30 PM - 5:00 PM</option>
                                                                            </CSelect>
                                                                        </div>
                                                                    </CRow>
                                                                </CCol>
                                                            </CModalBody>
                                                            <CModalFooter>
                                                                <CButton className={'btn btn-primary'} onClick={solicitarCambioFecha}>Solicitar Cambio de fecha</CButton>
                                                            </CModalFooter>
                                                        </CModal>
                                                    </CCol>
                                                </CRow>
                                            </CContainer>
                                        </CCol>
                                        <CCol xs="12" sm="12" md="6" lg="6" className='containerTracking'>
                                            <TrackEvent className='m-auto' data={info}></TrackEvent>
                                            {(info.pedido.comentarios !== "" && info.pedido.comentarios !== null && info.pedido.comentarios !== "Sin comentarios...") &&
                                                <CRow>
                                                    <CCol xs="12" sm="11" md="10" lg="10" className={'m-auto'}>
                                                        <p className='titulo-comentarios-informacion'>Detalles de entrega</p>
                                                        <p className="comentarios-informacion" dangerouslySetInnerHTML={{ __html: (info.pedido.comentarios ?? "").replace(/\n/g, '<br />') }}></p>
                                                    </CCol>
                                                </CRow>
                                            }
                                        </CCol>
                                    </CRow>
                                </CCardBody>
                            </CCard>
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12" sm="12" md="12" lg="12" className={"container-whatsapp-informacion"}>
                            <p className='text-whatsapp-informacion'>Si necesitas mas informacion sobre tu paquete</p>
                            <CButton className={"btn-whatsapp-informacion"} color="success" onClick={() => window.open(`https://api.whatsapp.com/send?phone=50242860214&text=Hola%20me%20gustar%C3%ADa%20saber%20en%20donde%20esta%20mi%20paquete,%20esta%20es%20la%20clave%20del%20pedido:%20${info?.pedido?.guia}`, '_blank')}>
                                <img src="img/whatsapp.png" alt="WhatsApp" /> <span>Clic aquí</span>
                            </CButton>
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

