import CIcon from '@coreui/icons-react';
import {
    CButton, CCard,
    CCardBody, CCardHeader,
    CCol, CCollapse, CContainer, CFormGroup, CImg, CInput, CLabel, CRow, CSwitch
} from '@coreui/react';
import { faTruckMonster } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import 'core-js/es/array';
import { useEffect, useRef, useState } from 'react';
import { data } from 'react-dom-factories';
import {
    useHistory
} from "react-router-dom";
import Select from 'react-select';
import { useToasts } from 'react-toast-notifications';
import { reactLocalStorage } from 'reactjs-localstorage';
import { v4 as uuidv4 } from 'uuid';




const CreacionPedido = () => {
    const history = useHistory();
    const { addToast } = useToasts();
    const [step, setStep] = useState(0);
    const [rows_data, setRowsData] = useState([]);
    const [data, setData] = useState({
        remitente: "",
        nombre_empresa_remitente: "",
        telefono_remitente: "",
        correo_remitente: "",
        municipio_remitente: "",
        municipioId_remitente: 0,
        departamentoId_remitente: 0,
        direccion_remitente: "",
        destinatario: "",
        name_destinatario: "",
        telefono_destinatario: "",
        correo_destinatario: "",
        municipio_destinatario: "test",
        direccion_destinatario: "",
        referencias_destinatario: "",
        pobladoDestino: 0,
        pobladoOrigen: 0,
        cupon: ""
    });
    const [poblado, setPoblado] = useState([]);
    const [pobladoOrigen, setPobladoOrigen] = useState([]);
    const [pobladoOrigenDefault, setPobladoOrigenDefault] = useState([]);
    const [user, setUser] = useState({});
    const [seguro_value, setSeguroValue] = useState(0);
    const [cupon_value, setCuponValue] = useState({
        value: 0,
        tipo: ''
    });
    const [cod_value, setCodValue] = useState(0);
    const [costo_de_envio, setCostoDeEnvio] = useState(0);
    const [consto_de_envio_text_cotiza, setCostoDeEnvioTextCotiza] = useState('');
    const [total_valor_declarado, setTotalValorDeclarado] = useState(0);
    const [cobro, setCobro] = useState({
        efectivo: false,
        transferencia: false,
        contra_entrega: false,
    });
    const [payment, setPayment] = useState(false);
    const [pedido_creado, setPedidoCreado] = useState("");
    const [pedido_id, setPedidoId] = useState("");
    const [tipos_de_pago, setTiposDePago] = useState([]);
    const [estatus_de_pedido, setEstatusDePedido] = useState([]);
    const [tipos_de_transporte, setTiposDeTransporte] = useState([]);
    const [files, setFiles] = useState({
        img: null,
        file: null
    });
    const [departamentos, setDepartamentos] = useState([]);
    const [municipios, setMunicipios] = useState([]);
    const [value_departamento, setValueDepartamento] = useState("Guatemala");
    const [value_municipio, setValueMunicipio] = useState("Guatemala");
    const FileDownload = require('js-file-download');
    const [fee_cod, set_fee_cod] = useState('');
    const [cotizacionPedidoData, setCotizacionPedidoData] = useState({
        cobroExtra: 0,
        costoEnvio: 0,
        cupon: 0,
        pesoExtra: 0,
        seguro: 0,
        valorPaquetes: 0,
        total: 0
    });
    const [cotizacionValida, setCotizacionValida] = useState(true);
    // Fetch de departamentos

    useEffect(() => {
        const user_object = reactLocalStorage.getObject('user');

        if (user_object === 'undefined' || user_object === undefined || user_object === null || Object.keys(user_object).length === 0) {
            reactLocalStorage.remove('user');
            setUser({});
            history.push('/login');
            return false;
        }
        let base_url = 'https://ws.conectaguate.com/api'

        let transportes = new Promise((resolve, reject) => axios({ method: 'get', url: base_url + '/v1/site/transportes', headers: { 'Authorization': `Bearer ${user_object.token}` } }).then((data) => resolve({ key: 'transportes', data: data.data['Data'] }, 'transportes')));
        let estatus = new Promise((resolve, reject) => axios({ method: 'get', url: base_url + '/v1/site/estatus', headers: { 'Authorization': `Bearer ${user_object.token}` } }).then((data) => resolve({ key: 'estatus', data: data.data['Data'] }, 'estatus')));
        let tipos_de_pago = new Promise((resolve, reject) => axios({ method: 'get', url: base_url + '/v1/site/tipopago', headers: { 'Authorization': `Bearer ${user_object.token}` } }).then((data) => resolve({ key: 'tipos_de_pago', data: data.data['Data'] }, 'tipos_de_pago')));

        Promise.all([transportes, estatus, tipos_de_pago]).then((values) => {
            values.forEach((elem) => {
                let obj = {};
                switch (elem.key) {
                    case 'transportes':
                        elem.data.forEach((elem) => {
                            obj[elem.id] = elem;
                        })
                        setTiposDeTransporte(obj);
                        break;
                    case 'estatus':
                        elem.data.forEach((elem) => {
                            obj[elem.id] = elem;
                        })
                        setEstatusDePedido(obj);
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


    const createOrder = async () => {
        const order = {};
        const transportes = {
            "Moto": 1,
            "Panel": 2
        }

        let tipo_pa = 0;
        if (cobro.contra_entrega) {
            tipo_pa = 1;
        } else if (cobro.efectivo) {
            tipo_pa = 2
        } else if (cobro.transferencia) {
            tipo_pa = 3
        }

        order.pedido = {
            tipo_destino: 1,
            direccion_origen: data.direccion_remitente,
            nombre_origen: data.remitente,
            telefono_origen: data.telefono_remitente,
            departamento_origen: 0,
            municipio_origen: 0,
            direccion_destino: data.direccion_destinatario,
            nombre_destino: data.name_destinatario + "|" + data.destinatario,
            telefono_destino: data.telefono_destinatario,
            departamento_destino: 0,
            municipio_destino: 0,
            transporte: parseInt(rows_data[0].transporte),
            tipo_envio: 1,  //
            tipo_pago: tipo_pa === 0 ? 4 : tipo_pa, // 
            COD: (cod_value !== 0) ? true : false,
            valorCod: cod_value,
            remitente: payment,
            seguro: seguro_value,
            pobladoDestino: data.pobladoDestino,
            pobladoOrigen: data.pobladoOrigen,
            costo_envio: costo_de_envio, // return api cotizar
            total: total_valor_declarado,
            cupon: data.cupon    // return api cotizar 
        };

        let arr = [];
        rows_data.forEach((elem) => {
            arr.push({
                id_transporte: parseInt(elem.transporte),
                valor: parseInt(elem.precio),
                fragil: (elem.fragil === 'off') ? false : true,
                descripcion: elem.paquete
            });
        })

        order.detalle = arr;


        if (!cobro.contra_entrega && !cobro.efectivo && !cobro.transferencia) {
            addToast(`Debes seleccionar un metodo de pago`, {
                appearance: 'warning',
                autoDismiss: true,
                autoDismissTimeout: 4000
            });
            return false;
        }
        // return false;
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
            url: 'https://ws.conectaguate.com/api/v1/site/pedido/crear',
            headers: {
                'Authorization': bearer,
                'Content-Type': 'application/json'
            },
            data: order
        }).then((response) => {
            let data = response.data;

            //enviar voucher de pago
            if (order.pedido.tipo_pago === 3) {
                var bodyFormData = new FormData();
                bodyFormData.append(
                    "img",
                    files.file,
                    files.file.name
                );
                axios({
                    method: "post",
                    url: `https://ws.conectaguate.com/api/v1/site/pedido/img/add/${data["Data"].id}`,
                    headers: {
                        'Authorization': `Bearer ${user_object.token}`,
                        'Content-Type': 'multipart/form-data'
                    },
                    data: bodyFormData,
                }).then(
                    (result) => {
                        addToast(`Se subio el voucher de pago correctamente.`, {
                            appearance: 'success',
                            autoDismiss: true,
                            autoDismissTimeout: 4000
                        });
                    },
                    (error) => {
                        addToast(`No se pudo enviar el voucher, por favor enviarlo al correo: psoto@conectaguate.com con numero de pedido`, {
                            appearance: 'warning',
                            autoDismiss: true,
                            autoDismissTimeout: 10000
                        });
                    }
                );
                // .then(function (response) {
                //     addToast(`Se subio el voucher de pago correctamente.`, {
                //         appearance: 'success',
                //         autoDismiss: true,
                //         autoDismissTimeout: 4000
                //     });
                // })
                // .catch(function (response) {
                //     addToast(`No se pudo enviar el voucher, por favor enviarlo al correo: psoto@conectaguate.com con numero de pedido`, {
                //         appearance: 'warning',
                //         autoDismiss: true,
                //         autoDismissTimeout: 10000
                //     });
                // });   
            }
            addToast(`Se guardo el pedido correctamente`, {
                appearance: 'success',
                autoDismiss: true,
                autoDismissTimeout: 4000
            });

            setPedidoCreado(data["Data"].guia)
            setPedidoId(data["Data"].id)
            setData({
                ...data,
                destinatario: "",
                name_destinatario: "",
                telefono_destinatario: "",
                correo_destinatario: "",
                municipio_destinatario: "",
                direccion_destinatario: "",
                referencias_destinatario: ""
            });
            setSeguroValue(0);
            setCuponValue({
                value: 0,
                tipo: ''
            });
            setCodValue(0);
            setCostoDeEnvio(0);
            setTotalValorDeclarado(0);
            setRowsData([]);
            setStep(4);
            setFiles({});
        }, (error) => {
            addToast(`Intente mas tarde`, {
                appearance: 'error',
                autoDismiss: true,
                autoDismissTimeout: 4000
            });
        });

        return false;
    }


    const cotizarOrder = async () => {
        const order = {};

        let tipo_pa = 0;
        if (cobro.contra_entrega) {
            tipo_pa = 1;
        } else if (cobro.efectivo) {
            tipo_pa = 2
        } else if (cobro.transferencia) {
            tipo_pa = 3
        }

        order.pedido = {
            tipo_destino: 1,
            direccion_origen: data.direccion_remitente,
            nombre_origen: data.remitente,
            telefono_origen: data.telefono_remitente,
            departamento_origen: 0,
            municipio_origen: 0,
            direccion_destino: data.direccion_destinatario,
            nombre_destino: data.name_destinatario,
            telefono_destino: data.telefono_destinatario,
            departamento_destino: 0,
            municipio_destino: 0,
            transporte: parseInt(rows_data[0].transporte),
            tipo_envio: 1,  //
            tipo_pago: tipo_pa === 0 ? 4 : tipo_pa, // 
            COD: (cod_value === 0) ? false : true,
            valorCod: cod_value,
            seguro: seguro_value,
            pobladoDestino: data.pobladoDestino,
            pobladoOrigen: data.pobladoOrigen,
            costo_envio: costo_de_envio, // return api cotizar
            total: total_valor_declarado,   // return api cotizar 
            cupon: data.cupon,
            remitente: payment
        };

        let arr = [];
        rows_data.forEach((elem) => {
            arr.push({
                id_transporte: parseInt(elem.transporte),
                valor: parseInt(elem.precio),
                fragil: (elem.fragil === 'off') ? false : true,
                peso: elem.peso
            });
        })

        order.detalle = arr;
        // return false;
        const user_object = reactLocalStorage.getObject('user');

        let bearer = "";
        if (user_object === 'undefined' || user_object === undefined || user_object === null || Object.keys(user_object).length === 0) {
            reactLocalStorage.remove('user');
            history.push('/login');
        } else {
            bearer = `Bearer ${user_object.token}`;
        }

        return await axios({
            method: 'post',
            url: 'https://ws.conectaguate.com/api/v1/site/pedido/cotizacion',
            headers: {
                'Authorization': bearer,
                'Content-Type': 'application/json'
            },
            data: order
        }).then((response) => {
            let data = response.data;
            return data;
        }).catch(function (error) {
            if (error.response) {
                return error;
            }
        });
    }

    const cotizarOrderSinCOD = async () => {
        const order = {};

        let tipo_pa = 0;
        if (cobro.contra_entrega) {
            tipo_pa = 1;
        } else if (cobro.efectivo) {
            tipo_pa = 2
        } else if (cobro.transferencia) {
            tipo_pa = 3
        }

        order.pedido = {
            tipo_destino: 1,
            direccion_origen: data.direccion_remitente,
            nombre_origen: data.remitente,
            telefono_origen: data.telefono_remitente,
            departamento_origen: 0,
            municipio_origen: 0,
            direccion_destino: data.direccion_destinatario,
            nombre_destino: data.name_destinatario,
            telefono_destino: data.telefono_destinatario,
            departamento_destino: 0,
            municipio_destino: 0,
            transporte: parseInt(rows_data[0].transporte),
            tipo_envio: 1,  //
            tipo_pago: tipo_pa === 0 ? 4 : tipo_pa, // 
            COD: false,
            valorCod: 0,
            seguro: seguro_value,
            pobladoDestino: data.pobladoDestino,
            pobladoOrigen: data.pobladoOrigen,
            costo_envio: costo_de_envio, // return api cotizar
            total: total_valor_declarado,   // return api cotizar 
            cupon: data.cupon,
            remitente: payment
        };

        let arr = [];
        rows_data.forEach((elem) => {
            arr.push({
                id_transporte: parseInt(elem.transporte),
                valor: parseInt(elem.precio),
                fragil: (elem.fragil === 'off') ? false : true,
                peso: elem.peso
            });
        })

        order.detalle = arr;
        // return false;
        const user_object = reactLocalStorage.getObject('user');

        let bearer = "";
        if (user_object === 'undefined' || user_object === undefined || user_object === null || Object.keys(user_object).length === 0) {
            reactLocalStorage.remove('user');
            history.push('/login');
        } else {
            bearer = `Bearer ${user_object.token}`;
        }

        return await axios({
            method: 'post',
            url: 'https://ws.conectaguate.com/api/v1/site/pedido/cotizacion',
            headers: {
                'Authorization': bearer,
                'Content-Type': 'application/json'
            },
            data: order
        }).then((response) => {
            let data = response.data;
            return data;
        }).catch(function (error) {
            if (error.response) {
                return error;
            }
        });
    }



    useEffect(() => {
        const user_object = reactLocalStorage.getObject('user');
        let bearer = "";

        if (user_object === 'undefined' || user_object === undefined || user_object === null || Object.keys(user_object).length === 0) {
            reactLocalStorage.remove('user');
            history.push('/login');
        } else {
            bearer = `Bearer ${user_object.token}`;
        }

        const config = {
            headers: {
                "Authorization": bearer
            }
        };

        axios.get(
            'https://ws.conectaguate.com/api/v1/site/usuario/information',
            config
        ).then((response) => {
            let data_usuario = response.data.usuario;
            if (data_usuario === null) {
                addToast(`Debes llenar tu información antes de crear un pedido`, {
                    appearance: 'warning',
                    autoDismiss: true,
                    autoDismissTimeout: 4000
                });
                history.push('/cuenta/perfil');
                return false;
            };
            axios({
                method: 'get',
                url: `https://ws.conectaguate.com/api/v1/site/poblado/dep/${response.data.usuario.departamentoId}/mun/${response.data.usuario.municipioId}`,
                headers: {
                    'Authorization': bearer
                }
            }).then((response) => {
                let dataPoblado = response.data["Data"];
                setPobladoOrigen(dataPoblado);
                setPobladoOrigenDefault(dataPoblado);
                setData({
                    ...data,
                    remitente: data_usuario.nombre + " " + data_usuario.apellido,
                    nombre_empresa_remitente: data_usuario.empresa,
                    telefono_remitente: data_usuario.phone,
                    correo_remitente: data_usuario.email,
                    municipio_remitente: data_usuario.municipio,
                    direccion_remitente: data_usuario.direccion_recoleccion,
                    municipioId_remitente: data_usuario.municipioId,
                    departamentoId_remitente: data_usuario.departamentoId,
                    pobladoOrigen: dataPoblado[0].id
                })
            }, (error) => {
                return false;
            });
        });


        axios({
            method: 'get',
            url: 'https://ws.conectaguate.com/api/v1/site/departamentos',
            headers: {
                'Authorization': bearer
            },
        }).then((response) => {
            let data = response.data["Data"];
            setDepartamentos(data);
        }, (error) => {
            setDepartamentos([]);
            return false;
        });

        axios({
            method: 'get',
            url: 'https://ws.conectaguate.com/api/v1/site/departamentos/1',
            headers: {
                'Authorization': bearer
            },
        }).then((response) => {
            let data = response.data["Data"];
            setMunicipios(data.municipios);
        }, (error) => {
            return false;
        });


    }, []);


    useEffect(() => {
        const user_object = reactLocalStorage.getObject('user');
        if (user_object === 'undefined' || user_object === undefined || user_object === null || Object.keys(user_object).length === 0) {
            reactLocalStorage.remove('user');
            setUser({});
            history.push('/login');
        } else {
            if (!('name' in user_object)) {
                try {
                    axios.get(
                        'https://ws.conectaguate.com/api/auth/user',
                        {
                            headers: {
                                'Authorization': `Bearer ${user_object.token}`
                            },
                        },
                    ).then(
                        (result) => {
                            setUser({
                                ...user_object,
                                name: result.data.name
                            });
                            reactLocalStorage.setObject('user', {
                                ...user_object,
                                name: result.data.name
                            });
                        },
                        (error) => {
                            if (error.response) {

                            }
                        });
                } catch (e) {

                    return false;
                }

            } else {
                setUser({
                    ...user_object
                });
            }

        }
    }, []);

    useEffect(() => {
        const user_object = reactLocalStorage.getObject('user');

        if (user_object === 'undefined' || user_object === undefined || user_object === null || Object.keys(user_object).length === 0) {
            reactLocalStorage.remove('user');
            setUser({});
            history.push('/login');
            return false;
        }

        let config = {
            headers: { 'Authorization': `Bearer ${user_object.token}` }
        };
        let base_url = 'https://ws.conectaguate.com/api'

        let transportes = new Promise((resolve, reject) => axios({ method: 'get', url: base_url + '/v1/site/transportes', headers: { 'Authorization': `Bearer ${user_object.token}` } }).then((data) => resolve({ key: 'transportes', data: data.data['Data'] }, 'transportes')));
        let estatus = new Promise((resolve, reject) => axios({ method: 'get', url: base_url + '/v1/site/estatus', headers: { 'Authorization': `Bearer ${user_object.token}` } }).then((data) => resolve({ key: 'estatus', data: data.data['Data'] }, 'estatus')));
        let tipos_de_pago = new Promise((resolve, reject) => axios({ method: 'get', url: base_url + '/v1/site/tipopago', headers: { 'Authorization': `Bearer ${user_object.token}` } }).then((data) => resolve({ key: 'tipos_de_pago', data: data.data['Data'] }, 'tipos_de_pago')));

        Promise.all([transportes, estatus, tipos_de_pago]).then((values) => {
        });
    }, []);


    useEffect(() => {
        if (user) {
            if (user.email === 'test010@gmail.com') {
                let new_data = {
                    correo_remitente: "chinocum@gmail.com",
                    direccion_remitente: "2 calle 38-61 zona 11",
                    municipio_remitente: "Guatemala",
                    nombre_empresa_remitente: "Test",
                    remitente: "Diego Cum",
                    telefono_remitente: "12345678"
                }
                setData({ ...data, ...new_data });
            }
        }
    }, [user])

    const handleChange = (e) => {
        const { id, value } = e.target;
        let data_copy = JSON.parse(JSON.stringify(data));
        data_copy = {
            ...data_copy,
            [id]: value
        }
        setData(data_copy);
    }

    const handleChangePobladoOrg = (e) => {
        const { value } = e;
        let data_copy = JSON.parse(JSON.stringify(data));
        data_copy = {
            ...data_copy,
            "pobladoOrigen": value
        }
        setData(data_copy);
    }

    const handleChangePobladoDest = (e) => {
        const { value } = e;
        let data_copy = JSON.parse(JSON.stringify(data));
        data_copy = {
            ...data_copy,
            "pobladoDestino": value
        }
        setData(data_copy);
    }

    const actualizacionCupon = (cupon) => {
        const copyData = data;
        copyData.cupon = cupon;
        setData({
            ...copyData
        });
    }

    const eliminarCupon = async () => {
        handleChange({ target: { id: 'cupon_input', value: '' } });
        await actualizacionCupon(null);
        cotizarOrder();
    }

    const nextStep = (step) => {
        let allow = true;
        if (step === 1) {
            let labels = {
                remitente: "¿Quién envia?",
                telefono_remitente: "Teléfono (Remitente)",
                correo_remitente: "Correo Electronico (Remitente)",
                pobladoOrigen: "Poblado (Remitente)",
                direccion_remitente: "Direccion (Remitente)",
                destinatario: "¿Quién recibe?",
                telefono_destinatario: "Teléfono (Destinatario)",
                pobladoDestino: "Poblado (Destinatario)",
                direccion_destinatario: "Dirección (Destinatario)",
            };

            for (const [key, value] of Object.entries(data)) {
                if (key in labels && value.length === 0) {
                    addToast(`El campo ${labels[key]} es requerido`, {
                        appearance: 'error',
                        autoDismiss: true,
                        autoDismissTimeout: 4000
                    });
                    allow = false;
                }

                const em = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (key === 'correo_remitente') {
                    if (!em.test(String(value).toLowerCase())) {
                        addToast(`El ${labels[key]} no es valido`, {
                            appearance: 'error',
                            autoDismiss: true,
                            autoDismissTimeout: 4000
                        });
                        allow = false;
                    }
                }
            }
        }

        return allow;
    }

    const buscarPobladoOrigen = (e) => {
        const { value } = e.target;
        if (value.length <= 2) {
            setPobladoOrigen(pobladoOrigenDefault);
            return;
        }
        const user_object = reactLocalStorage.getObject('user');
        let bearer = "";

        if (user_object === 'undefined' || user_object === undefined || user_object === null || Object.keys(user_object).length === 0) {
            reactLocalStorage.remove('user');
            history.push('/login');
        } else {
            bearer = `Bearer ${user_object.token}`;
        }

        axios({
            method: 'get',
            url: `https://ws.conectaguate.com/api/v1/site/poblado/search/${value}`,
            headers: {
                'Authorization': bearer
            }
        }).then((response) => {
            let data = response.data["Data"];
            setPobladoOrigen(data);
        }, (error) => {
            return false;
        });
    }

    const buscarPoblado = (e) => {
        const { value } = e.target;
        if (value.length <= 2) {
            return;
        }
        const user_object = reactLocalStorage.getObject('user');
        let bearer = "";

        if (user_object === 'undefined' || user_object === undefined || user_object === null || Object.keys(user_object).length === 0) {
            reactLocalStorage.remove('user');
            history.push('/login');
        } else {
            bearer = `Bearer ${user_object.token}`;
        }

        axios({
            method: 'get',
            url: `https://ws.conectaguate.com/api/v1/site/poblado/search/${value}`,
            headers: {
                'Authorization': bearer
            }
        }).then((response) => {
            let data = response.data["Data"];
            setPoblado(data);
        }, (error) => {
            return false;
        });
    }

    const descargarGuia = (key) => {
        const user_object = reactLocalStorage.getObject('user');
        let bearer = "";

        if (user_object === 'undefined' || user_object === undefined || user_object === null || Object.keys(user_object).length === 0) {
            reactLocalStorage.remove('user');
            history.push('/login');
        } else {
            bearer = `Bearer ${user_object.token}`;
        }

        axios({
            url: `https://ws.conectaguate.com/api/v1/site/pedido/guia/${key}`,
            method: 'GET',
            responseType: 'blob',
            headers: {
                "Authorization": bearer
            }
        }).then((response) => {
            FileDownload(response.data, `${key}.pdf`);
        });
    }


    return (
        (user) ?
            <div className="creacion-pedido">
                {(step === 0) ?
                    <Step1
                        changeStep={setStep}
                        data={data}
                        handleChange={handleChange}
                        user={user}
                        checkNextStep={nextStep}
                        payment={payment}
                        setPayment={setPayment}
                        departamentos={departamentos}
                        municipios={municipios}
                        poblado={poblado}
                        pobladoOrig={pobladoOrigen}
                        buscarPobladoOrigen={buscarPobladoOrigen}
                        buscarPoblado={buscarPoblado}
                        value_departamento={value_departamento}
                        value_municipio={value_municipio}
                        setValueDepartamento={setValueDepartamento}
                        setValueMunicipio={setValueMunicipio}
                        handleChangePobladoOrg={handleChangePobladoOrg}
                        handleChangePobladoDest={handleChangePobladoDest}
                        cobro={cobro}
                        setCobro={setCobro}
                    />
                    :
                    (step === 1) ?
                        <Step2
                            changeStep={setStep}
                            addToast={addToast}
                            rows_data={rows_data}
                            setRowsData={setRowsData}
                            cod={cod_value}
                            cupon={cupon_value}
                            seguro={seguro_value}
                            setValorDeclarado={setTotalValorDeclarado}
                            setCod={setCodValue}
                            setCupon={setCuponValue}
                            actualizarCupon={actualizacionCupon}
                            eliminarCupon={eliminarCupon}
                            setSeguro={setSeguroValue}
                            cobro={cobro}
                            fee_cod={fee_cod}
                            set_fee_cod={set_fee_cod}
                            setCotizacionPedidoData={setCotizacionPedidoData}
                            cotizacionPedidoData={cotizacionPedidoData}
                            setCobro={setCobro}
                            cotizar={cotizarOrder}
                            setCostoDeEnvio={setCostoDeEnvio}
                            tipos_de_transporte={tipos_de_transporte}
                            costo_de_envio={costo_de_envio}
                            setCostoDeEnvioTextCotiza={setCostoDeEnvioTextCotiza}
                            consto_de_envio_text_cotiza={consto_de_envio_text_cotiza}
                            data={data}
                            setCotizacionValida={setCotizacionValida}
                            cotizacionValida={cotizacionValida}
                            cotizarOrderSinCOD={cotizarOrderSinCOD}
                        />
                        : (step === 2) ?
                            <Step3
                                changeStep={setStep}
                                setData={setData}
                                data={data}
                                rows_data={rows_data}
                                handleChange={handleChange}
                                user={user}
                                checkNextStep={nextStep}
                                cobro={cobro}
                                setCobro={setCobro}
                                cupon={cupon_value}
                                seguro={seguro_value}
                                createOrder={createOrder}
                                setFiles={setFiles}
                                costo_de_envio={costo_de_envio}
                                files={files}
                                consto_de_envio_text_cotiza={consto_de_envio_text_cotiza}
                            /> :
                            <Step4
                                changeStep={setStep}
                                data={data}
                                rows_data={rows_data}
                                handleChange={handleChange}
                                user={user}
                                checkNextStep={nextStep}
                                pedido={pedido_creado}
                                pedido_id={pedido_id}
                                files={files}
                                descargarGuia={descargarGuia}
                            />}
            </div> : null
    )
}


const Step1 = (props) => {
    const [payment, setPayment] = useState(false);

    const handleChange = (e) => {
        const { id, value } = e.target;
        if (id === 'payment') {
            if (payment) {
                setPayment(false);
                props.setPayment(false);
                props.setCobro({
                    efectivo: false,
                    transferencia: false,
                    contra_entrega: false
                });
            } else {
                setPayment(true);
                props.setPayment(true);
                props.setCobro({
                    efectivo: true,
                    transferencia: false,
                    contra_entrega: false
                });
            }
        }
    }

    useEffect(() => {
        setPayment(props.payment)
    }, []);


    return (
        <>
            <div className="creacion-pedido-progress-bar">
                <CRow>
                    <CCol sm="9">
                    </CCol>
                    <CCol sm="3">
                        <div className="wrap">
                            <ul id="progressbar">
                                <li className="active" id="first"><strong></strong></li>
                                <li id="second"><strong></strong></li>
                                <li id="third"><strong></strong></li>
                            </ul>
                        </div>
                    </CCol>
                </CRow>
            </div>

            <CCard className="creacion-pedido-card">
                <CCardBody className="card-body">
                    <CRow>
                        <CCol sm="5">
                            <div className="card-title">
                                <h3>Remitente</h3>
                            </div>
                        </CCol>
                    </CRow>
                    {/* // MARK: Origen */}
                    <CRow>
                        <CCol xs="12">
                            <CFormGroup row>
                                <CCol xs="12" md="3">
                                    <CLabel htmlFor="text-input">¿Quién envia?</CLabel><CLabel htmlFor="text-input" style={{ color: '#cdde0c' }}>*</CLabel>
                                </CCol>
                                <CCol xs="12" md="9">
                                    <CInput value={props.data.remitente} onChange={props.handleChange} className="card-input" id="remitente" data-end="t" placeholder="" required />
                                </CCol>
                            </CFormGroup>
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12">
                            <CFormGroup row>
                                <CCol xs="12" md="3">
                                    <CLabel htmlFor="text-input">Nombre de empresa</CLabel>
                                </CCol>
                                <CCol xs="12" md="9">
                                    <CInput value={props.data.nombre_empresa_remitente} onChange={props.handleChange} className="card-input" id="nombre_empresa_remitente" placeholder="" required />
                                </CCol>
                            </CFormGroup>
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12">
                            <CFormGroup row>
                                <CCol xs="12" md="3">
                                    <CLabel htmlFor="text-input">Teléfono</CLabel><CLabel htmlFor="text-input" style={{ color: '#cdde0c' }}>*</CLabel>
                                </CCol>
                                <CCol xs="12" md="9">
                                    <CInput value={props.data.telefono_remitente} onChange={props.handleChange} className="card-input" id="telefono_remitente" placeholder="" required />
                                </CCol>
                            </CFormGroup>
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12">
                            <CFormGroup row>
                                <CCol xs="12" md="3">
                                    <CLabel htmlFor="text-input">Correo electrónico</CLabel><CLabel htmlFor="text-input" style={{ color: '#cdde0c' }}>*</CLabel>
                                </CCol>
                                <CCol xs="12" md="9">
                                    <CInput value={props.data.correo_remitente} onChange={props.handleChange} className="card-input" id="correo_remitente" placeholder="" required />
                                </CCol>
                            </CFormGroup>
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12">
                            <CFormGroup row>
                                <CCol xs="12" md="3">
                                    <CLabel htmlFor="text-input">Poblado/Municipio</CLabel><CLabel htmlFor="text-input" style={{ color: '#cdde0c' }}>*</CLabel>
                                </CCol>
                                <CCol xs="12" md="9">
                                    <CRow>
                                        <CCol sm="12">
                                            <Select
                                                styles={{ border: '0px solid' }}
                                                className="card-input"
                                                onKeyDown={props.buscarPobladoOrigen}
                                                isSearchable={true}
                                                placeholder={"Departamento/Municipio"}
                                                id="pobladoOrigen"
                                                onChange={props.handleChangePobladoOrg}
                                                required
                                                options={
                                                    props.pobladoOrig.map(item => {
                                                        return { value: item.id, label: item.poblado }
                                                    })
                                                }
                                                value={
                                                    props.pobladoOrig.map((item, index) => {
                                                        if (index === 0 && props.data.pobladoOrigen === 0) {
                                                            return { value: item.id, label: item.poblado }
                                                        }
                                                        if (props.data.pobladoOrigen !== 0 && props.data.pobladoOrigen === item.id) {
                                                            return { value: item.id, label: item.poblado }
                                                        }

                                                    })
                                                }
                                            />
                                        </CCol>
                                    </CRow>
                                    {/* <CInput value={props.data.municipio_remitente}  onChange={props.handleChange} className="card-input" id="municipio_remitente" placeholder="" required /> */}
                                </CCol>
                            </CFormGroup>
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12">
                            <CFormGroup row>
                                <CCol xs="12" md="3">
                                    <CLabel htmlFor="text-input">Dirección</CLabel><CLabel htmlFor="text-input" style={{ color: '#cdde0c' }}>*</CLabel>
                                </CCol>
                                <CCol xs="12" md="9">
                                    <CInput value={props.data.direccion_remitente} onChange={props.handleChange} className="card-input" id="direccion_remitente" placeholder="" required />
                                </CCol>
                            </CFormGroup>
                        </CCol>
                    </CRow>
                </CCardBody>
            </CCard>
            <br />
            <CCard className="creacion-pedido-card">
                <CCardBody className="card-body">
                    <CRow>
                        <CCol sm="5">
                            <div className="card-title">
                                <h3>Destinatario</h3>
                            </div>
                        </CCol>
                    </CRow>
                    {/* // MARK: Origen */}
                    <CRow>
                        <CCol xs="12">
                            <CFormGroup row>
                                <CCol xs="12" md="3">
                                    <CLabel htmlFor="text-input">¿Quién recibe?</CLabel><CLabel htmlFor="text-input" style={{ color: '#cdde0c' }}>*</CLabel>
                                </CCol>
                                <CCol xs="12" md="9">
                                    <CInput value={props.data.destinatario} onChange={props.handleChange} className="card-input" id="destinatario" data-end="t" placeholder="" required />
                                </CCol>
                            </CFormGroup>
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12">
                            <CFormGroup row>
                                <CCol xs="12" md="3">
                                    <CLabel htmlFor="text-input">Nombre de contacto</CLabel>
                                </CCol>
                                <CCol xs="12" md="9">
                                    <CInput value={props.data.name_destinatario} onChange={props.handleChange} className="card-input" id="name_destinatario" placeholder="" required />
                                </CCol>
                            </CFormGroup>
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12">
                            <CFormGroup row>
                                <CCol xs="12" md="3">
                                    <CLabel htmlFor="text-input">Teléfono</CLabel><CLabel htmlFor="text-input" style={{ color: '#cdde0c' }}>*</CLabel>
                                </CCol>
                                <CCol xs="12" md="9">
                                    <CInput value={props.data.telefono_destinatario} onChange={props.handleChange} className="card-input" id="telefono_destinatario" placeholder="" type='number' required />
                                </CCol>
                            </CFormGroup>
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12">
                            <CFormGroup row>
                                <CCol xs="12" md="3">
                                    <CLabel htmlFor="text-input">Correo electrónico</CLabel>
                                </CCol>
                                <CCol xs="12" md="9">
                                    <CInput value={props.data.correo_destinatario} onChange={props.handleChange} className="card-input" id="correo_destinatario" placeholder="" />
                                </CCol>
                            </CFormGroup>
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12">
                            <CFormGroup row>
                                <CCol xs="12" md="3">
                                    <CLabel htmlFor="text-input">Departamento/Municipio</CLabel><CLabel htmlFor="text-input" style={{ color: '#cdde0c' }}>*</CLabel>
                                </CCol>
                                <CCol xs="12" md="9">
                                    <CRow>
                                        <CCol sm="12">
                                            <Select
                                                styles={{ border: '0px solid' }}
                                                className="card-input"
                                                onKeyDown={props.buscarPoblado}
                                                isSearchable={true}
                                                onChange={props.handleChangePobladoDest}
                                                placeholder={"Departamento/Municipio"}
                                                required
                                                options={
                                                    props.poblado.map(item => {
                                                        return { value: item.id, label: item.poblado }
                                                    })
                                                }
                                                value={
                                                    props.poblado.map((item, index) => {
                                                        if (index === 0 && props.data.pobladoDestino === 0) {
                                                            return { value: item.id, label: item.poblado }
                                                        }
                                                        if (props.data.pobladoDestino !== 0 && props.data.pobladoDestino === item.id) {
                                                            return { value: item.id, label: item.poblado }
                                                        }

                                                    })
                                                }
                                            />
                                            {/* <Select  isSearchable={true} className="card-input" onChange={handleChange} value={props.poblado} custom name="poblado" id="poblado" placeholder={"Departamento/Municipio"}>
                                                {props.poblado.map((elem)=>{
                                                    return <option key={elem.id} value={elem.id}>{elem.poblado}</option>
                                                })}
                                            </Select> */}
                                        </CCol>
                                    </CRow>
                                    {/* <CRow>
                                        <CCol sm="5">
                                            <CFormGroup>
                                                <CLabel htmlFor="departamento">Departamento</CLabel>
                                                <CFormGroup>
                                                    <CSelect onChange={handleChange} value={props.value_departamento} custom name="departamento" id="departamento">
                                                        <option value=""></option>
                                                        {props.departamentos.map((elem)=>{
                                                            return <option key={elem.id} value={elem.nombre}>{elem.nombre}</option>
                                                        })}
                                                    </CSelect>
                                                </CFormGroup>
                                            </CFormGroup>
                                        </CCol>
                                        <CCol sm="5">
                                            <CFormGroup>
                                                <CLabel htmlFor="municipio">Municipio</CLabel>
                                                <CFormGroup>
                                                    <CSelect onChange={handleChange} value={props.value_municipio} custom name="municipios" id="municipios">
                                                        <option value=""></option>
                                                        {props.municipios.map((elem)=>{
                                                            return <option key={elem.id} value={elem.nombre}>{elem.nombre}</option>
                                                        })}
                                                    </CSelect>
                                                </CFormGroup>
                                            </CFormGroup>
                                        </CCol>
                                    </CRow> */}
                                    {/* <CInput value={props.data.municipio_destinatario} onChange={props.handleChange} className="card-input" id="municipio_destinatario" placeholder="" required /> */}
                                </CCol>
                            </CFormGroup>
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12">
                            <CFormGroup row>
                                <CCol xs="12" md="3">
                                    <CLabel htmlFor="text-input">Dirección</CLabel><CLabel htmlFor="text-input" style={{ color: '#cdde0c' }}>*</CLabel>
                                </CCol>
                                <CCol xs="12" md="9">
                                    <CInput value={props.data.direccion_destinatario} onChange={props.handleChange} className="card-input" id="direccion_destinatario" placeholder="" required />
                                </CCol>
                            </CFormGroup>
                        </CCol>
                    </CRow>
                    <CRow>
                        <CCol xs="12">
                            <CFormGroup row>
                                <CCol xs="12" md="3">
                                    <CLabel htmlFor="text-input">Referencias de dirección</CLabel>
                                </CCol>
                                <CCol xs="12" md="9">
                                    <textarea rows="6" value={props.data.referencias_destinatario} onChange={props.handleChange} className="card-input" id="referencias_destinatario" placeholder="" required />
                                </CCol>
                            </CFormGroup>
                        </CCol>
                    </CRow>
                </CCardBody>
            </CCard>
            <br />

            <div className="creacion-pedido-button-envio">
                <CRow className="mb-4">
                    <CCol>
                        <CRow>
                            <CCol sm="5">
                                <div className="creacion-pedido-button-title">
                                    <h4>¿Quién pagará el envío:</h4>
                                </div>

                            </CCol>
                            <CCol sm="3">
                                <CRow className="switch-container">
                                    <label className="switch">
                                        <input type="checkbox" id="payment" value={payment} checked={payment} onChange={handleChange} />
                                        <div className="slider round">
                                            <span className="on">Remitente</span>
                                            <span className="off">Destinatario</span>
                                        </div>
                                    </label>
                                </CRow>
                            </CCol>
                        </CRow>
                    </CCol>
                    {/* <CCol sm="0"></CCol> */}
                    <CCol sm="4">
                        <CRow className="buttons-next">
                            <label className="next">
                                Siguiente
                            </label>
                            <button
                                type="button"
                                className="btn btn-danger btn-circle btn-xl"
                                onClick={
                                    () => {
                                        if (props.checkNextStep(1)) {
                                            props.changeStep(1);
                                            document.body.scrollTop = document.documentElement.scrollTop = 0;
                                        }
                                    }
                                }
                            >
                                <CIcon
                                    style={{ color: 'white', width: '2rem', height: '2rem', fontSize: '2rem' }}
                                    name="cil-arrow-right"
                                />
                            </button>
                        </CRow>
                    </CCol>
                </CRow>
            </div>
            <br />
        </>
    )
}

const Step2 = (props) => {
    const { addToast } = useToasts();
    const [seguro, setSeguro] = useState('off');
    const [cod, setCod] = useState('off');
    const [cupon_value, setCuponValue] = useState({
        value: 0,
        tipo: ''
    });
    const [total_valor_declarado, setTotalValorDeclarado] = useState(0.00);
    const [render_rows, setRenderRows] = useState(null);
    const [rows_jsx, setRowsJSX] = useState(null);
    const [input_value_seguro, setInputValueSeguro] = useState(0.00);
    const [input_value_cod, setInputValorCod] = useState(0.00);
    const [input_value_cupon, setInputValueCupon] = useState('');
    const [costo_de_envio, setCostoDeEnvio] = useState(0.00);
    const [costo_de_envio_text, setCostoDeEnvioText] = useState('');

    const [cupon_text, setCuponText] = useState('');

    const handleChange = async (e) => {
        const { id, value } = e.target;
        if (id === 'cod') {
            if (cod === 'on') {
                setCod('off');
                props.setCod(0);
                setInputValorCod(0.00);
                if (!props.cobro.efectivo) {
                    props.setCobro({
                        efectivo: false,
                        transferencia: false,
                        contra_entrega: false
                    });
                }
                cotizarUpdate(true);
            } else if (cod === 'off') {
                setCod('on');
                if (!props.cobro.efectivo) {
                    props.setCobro({
                        efectivo: false,
                        transferencia: false,
                        contra_entrega: true
                    });
                }
            }
        }
        if (id === 'seguro') {
            if (seguro === 'on') {
                setSeguro('off');
                props.setSeguro(0);
                setInputValueSeguro(0);
            } else if (seguro === 'off') {
                setSeguro('on');
            }
        }

        let val;
        let inputValueSeguro;
        let inputValueCod;

        if (id === 'seguro_input') {
            if (value === '' || value < 0) {
                val = '';
                inputValueSeguro = '';
            } else {
                val = parseFloat(value);
                inputValueSeguro = parseFloat(value);
            }
            props.setSeguro(val);
            setInputValueSeguro(inputValueSeguro);
        }

        if (id === 'cod_input') {
            if (value === '' || value < 0) {
                val = '';
                inputValueCod = '';
            } else {
                val = value
                inputValueCod = parseFloat(value);
            }
            props.setCod(inputValueCod);
            setInputValorCod(inputValueCod);
        }

        if (id === 'cupon_input') {
            setInputValueCupon(value);
        }
    }

    useEffect(() => {
        if (props.rows_data) {
            if (props.rows_data.length > 0) {
                cotizarUpdate();
            }
        }
    }, [props.seguro])

    const nextStep = () => {
        if (props.rows_data.length === 0) {
            addToast(`Tiene que añadir un paquete para continuar`, {
                appearance: 'error',
                autoDismiss: true,
                autoDismissTimeout: 4000
            });
            return false;
        }

        if (!props.cotizacionValida) {
            addToast(`El COD tiene que tener otro valor`, {
                appearance: 'error',
                autoDismiss: true,
                autoDismissTimeout: 4000
            });
            return false;
        }

        props.changeStep(2);
    }

    useEffect(() => {
        let value = 0.00;
        let render = [];
        if (props.rows_data) {
            setRowsJSX([]);
            if (props.rows_data.length > 0) {
                props.rows_data.forEach((elem, index) => {
                    value += parseFloat(elem.precio);
                    render.push(<RowPackageStatic rows={props.rows_data} setRows={props.setRowsData} key={`row-${index}`} data={elem} number={index} tipos_de_transporte={props.tipos_de_transporte} />);
                })
                setRenderRows([...render]);
                setTotalValorDeclarado(value);
                props.setValorDeclarado(value);
                cotizarUpdate();
            } else {
                setTotalValorDeclarado(0);
                props.setValorDeclarado(value);
            }
        }
    }, [props.rows_data])

    const cotizarUpdate = async (sincod) => {
        if (sincod === undefined) {
            sincod = false;
        }

        let response = sincod == true ? await props.cotizarOrderSinCOD() : await props.cotizar();

        if (response !== undefined && response !== null
            && response.response !== undefined
            && response.response !== null
            && response.response.status !== undefined
            && response.response.status !== null
            && response.response.status === 405) {

            props.setCotizacionValida(false);
            addToast(`Error: ${response.response.data.Message}`, {
                appearance: 'error',
                autoDismiss: true,
                autoDismissTimeout: 4000
            });
        } else {
            props.setCotizacionValida(true);
        }
        if (response['Costo_envio']) {
            setCostoDeEnvio(response['Costo_envio'].toFixed(2));
            props.setCostoDeEnvio(response['Costo_envio'].toFixed(2));
        }
        costoDeEnvio(response['Costo_envio']);
        if (response['Data']) {
            props.setCotizacionPedidoData({
                cobroExtra: response['Data']['cobroExtra'] || null,
                costoEnvio: response['Data']['costoEnvio'] || null,
                cupon: response['Data']['cupon'] || null,
                pesoExtra: response['Data']['pesoExtra'] || null,
                seguro: response['Data']['seguro'] || null,
                valorPaquetes: response['Data']['valorPaquetes'] || null,
                total: response['Costo_envio'] || null
            });
        }
    }

    useEffect(() => {
        const cobro = props.cobro;
        let costo_init = 0;
        let tipo_pa = 0;
        if (cobro.contra_entrega) {
            tipo_pa = 1;
        } else if (cobro.efectivo) {
            tipo_pa = 2
        } else if (cobro.transferencia) {
            tipo_pa = 3
        }
        if (tipo_pa === 1) {
            setCod('on');
        }
        if (props.seguro !== 0 && props.seguro !== '') {
            setSeguro('on');
            setInputValueSeguro((props.seguro / .02).toFixed(2));
        }
        if (props.costo_de_envio !== 0 && props.costo_de_envio !== '') {
            setCostoDeEnvio(props.costo_de_envio);
            costo_init = props.costo_de_envio;
        }


        //Ingreso valor cupon
        let text = '-';
        setCuponText(text);


        let costo_text = '-';
        if (props.cupon.value !== 0) {
            switch (props.cupon.tipo) {
                case 'porcentaje':
                    if (costo_init !== 0.00) {
                        costo_text = 'Q ' + (costo_init - (costo_init * (props.cupon.value / 100))).toFixed(2).toString();
                    }
                    break;
                case 'valorneto':
                    if (costo_init !== 0.00) {
                        costo_text = 'Q ' + (costo_init - props.cupon.value).toFixed(2).toString();
                    }
                    break;
                case 'gratis':
                    if (costo_init !== 0.00) {
                        costo_text = 'Q ' + (0.00).toFixed(2).toString();
                    }
                    break;
                default:
                    ;
            }
        }

        if (props.consto_de_envio_text_cotiza !== "") {
            setCostoDeEnvioText(props.consto_de_envio_text_cotiza);
        } else {
            setCostoDeEnvioText(costo_text);
        }
        props.setCostoDeEnvioTextCotiza(costo_text);

    }, [])

    const costoDeEnvio = (valor) => {
        if (valor === undefined || valor === null) {
            return;
        }
        const costo_text = 'Q ' + (valor).toString();
        setCostoDeEnvioText(costo_text);
        props.setCostoDeEnvioTextCotiza(costo_text);
    }

    useEffect(() => {
        costoDeEnvio(costo_de_envio);
    }, [costo_de_envio])

    const checkCoupon = async () => {
        const cupon = input_value_cupon;
        const user_object = reactLocalStorage.getObject('user');
        let valid = false;
        let val = 0;

        await axios({
            method: 'post',
            url: 'https://ws.conectaguate.com/api/v1/site/cupones/validar',
            headers: {
                'Authorization': `Bearer ${user_object.token}`,
                'Content-Type': 'application/json'
            },
            data: {
                "codigo": cupon
            }
        }).then((result) => {
            addToast(`Cupon Aplicado Exitosamente`, {
                appearance: 'success',
                autoDismiss: true,
                autoDismissTimeout: 4000
            });

            props.actualizarCupon(cupon);
            setCuponText(cupon);
            cotizarUpdate();
        },
            (error) => {
                addToast(error.response.data.Mensaje, {
                    appearance: 'error',
                    autoDismiss: true,
                    autoDismissTimeout: 4000
                });
                if (error.response) {
                    valid = false;
                    val = 0;
                }
                return {
                    valid: valid,
                    value: val
                }
            });
    }

    const eliminarCodigoCupon = async () => {
        await props.eliminarCupon();
        cotizarUpdate();
    }

    useEffect(() => {
        var rows = [];
        if (render_rows) {
            if (render_rows.length > 0) {
                for (var i = 0; i < render_rows.length; i++) {
                    rows.push(render_rows[i]);
                }
                setRowsJSX(rows);
            }
        }
    }, [render_rows])


    return (
        (input_value_cod !== null) ?
            <>
                <div className="creacion-pedido-progress-bar">
                    <CRow>
                        <CCol sm="9">
                        </CCol>
                        <CCol sm="3">
                            <div className="wrap">
                                <ul id="progressbar">
                                    <li className="active" id="first"><strong></strong></li>
                                    <li className="active" id="second"><strong></strong></li>
                                    <li id="third"><strong></strong></li>
                                </ul>
                            </div>
                        </CCol>
                    </CRow>
                </div>

                <CCard className="creacion-pedido-card">
                    <CCardBody className="card-body">
                        <CRow>
                            <CCol sm="12">
                                <div className="card-title-step2">
                                    <h3>Paquetes</h3>
                                </div>
                            </CCol>
                        </CRow>
                        {(Array.isArray(rows_jsx)) ? (rows_jsx.length > 0) ? <br /> : null : null}
                        {rows_jsx}
                        {(Array.isArray(rows_jsx)) ? (rows_jsx.length > 0) ? <br /> : null : null}
                        <RowPackage rows={props.rows_data} addRow={props.setRowsData} tipos_de_transporte={props.tipos_de_transporte} />

                    </CCardBody>
                </CCard>

                <CCard className="creacion-pedido-card" style={{ backgroundColor: '#FEFEFE' }}>
                    <CCardBody className="card-body">
                        <CRow>
                            <CCol sm="9">
                                <div className="card-title">
                                    <CRow>
                                        <h3>¿Es servicio pago contra entrega (COD)?&nbsp;&nbsp;&nbsp;</h3>
                                        <label className="switch">
                                            <input type="checkbox" id="cod" value={cod} checked={(cod === 'on' ? true : false)} onChange={handleChange} />
                                            <div className="slider round">
                                                <span className="on">Si</span>
                                                <span className="off">No</span>
                                            </div>
                                        </label>
                                    </CRow>
                                </div>
                                <CFormGroup style={{ display: (cod === 'off') ? 'none' : 'block' }}>
                                    <div className="input-box showMore">
                                        <strong style={{ fontSize: '1.5em !important' }}><span className="prefix">Q</span></strong>
                                        <CInput value={props.cod} onChange={handleChange} onBlur={cotizarUpdate} className="card-input" type="number" id="cod_input" placeholder="monto" style={{ fontSize: '1.5em !important' }} required />
                                    </div>
                                </CFormGroup>
                                <div className="card-body-step2">
                                    Al elegir servicio COD, su mercadería es cobrada en el destino. El monto se acreditará en su cuenta bancaria con un recargo del 4% del valor declarado y será descontado del monto a cobrar.
                                </div>
                            </CCol>
                        </CRow>
                        <CRow className="creacion-pedido-seguro-section">
                            <CCol sm="9">
                                <div className="card-title">
                                    <CRow>
                                        <h3>¿Deseas seguro adicional?&nbsp;&nbsp;&nbsp;</h3>
                                        <label className="switch">
                                            <input type="checkbox" id="seguro" value={seguro} checked={(seguro === 'on' ? true : false)} onChange={handleChange} />
                                            <div className="slider round">
                                                <span className="on">Si</span>
                                                <span className="off">No</span>
                                            </div>
                                        </label>
                                    </CRow>
                                </div>
                                <CFormGroup style={{ display: (seguro === 'off') ? 'none' : 'block' }}>
                                    <div className="input-box showMore">
                                        <span className="prefix">Q</span>
                                        <CInput type="number" onChange={handleChange} value={input_value_seguro} className="card-input" id="seguro_input" placeholder="monto a asegurar" style={{ backgroundColor: '#F4F5F9' }} required />
                                    </div>
                                </CFormGroup>
                                <div className="card-body-step2">
                                    Toda la mercadería está asegurada por un monto de hasta Q.500.00. Sin embargo puedes optar por asegurarla por un monto mayor con un recargo del 2%.
                                </div>
                            </CCol>
                        </CRow>
                        <br />
                        <CRow style={{ borderBottom: '2px solid #153b75' }}>
                        </CRow>
                        <br />
                        <CRow>
                            <CCol sm="5">
                                <div className="card-title">
                                    <h3>Tengo un cupón</h3>
                                </div>
                                <CFormGroup>
                                    <CInput className="card-input showMore" onChange={handleChange} value={input_value_cupon} id="cupon_input" placeholder="añadir código" style={{ backgroundColor: '#F4F5F9' }} />
                                </CFormGroup>
                                <CButton className="btn btn-primary" onClick={checkCoupon}>Validar Cupón</CButton>
                            </CCol>
                            <CCol sm="7" className="card-values-conecta">
                                <CRow>
                                    <CCol sm="8">Total Valor Productos</CCol>
                                    <CCol sm="4">{
                                        props.cotizacionPedidoData.valorPaquetes !== null && props.cotizacionPedidoData.valorPaquetes !== "" ?
                                            `Q${(props.cotizacionPedidoData.valorPaquetes).toFixed(2)}` :
                                            '-'
                                    }</CCol>
                                </CRow>

                                <CRow style={{ borderBottom: '2px solid #153b75' }}>
                                </CRow>

                                <CRow className="card-values-conecta">
                                    <CCol sm="8">Seguro Adicional</CCol>
                                    <CCol sm="4">{
                                        props.cotizacionPedidoData.seguro !== null && props.cotizacionPedidoData.seguro !== "" ?
                                            `Q${(props.cotizacionPedidoData.seguro).toFixed(2)}` :
                                            '-'
                                    }</CCol>
                                </CRow>
                                <CRow className="card-values-conecta" style={{ display: (props.cotizacionPedidoData.cobroExtra !== null && props.cotizacionPedidoData.cobroExtra !== "") ? 'flex' : 'none' }}>
                                    <CCol sm="8">Fee por COD</CCol>
                                    <CCol sm="4">{
                                        props.cotizacionPedidoData.cobroExtra !== null && props.cotizacionPedidoData.cobroExtra !== "" ?
                                            `Q${(props.cotizacionPedidoData.cobroExtra).toFixed(2)}` :
                                            '-'
                                    }</CCol>
                                </CRow>
                                <CRow className="card-values-conecta">
                                    <CCol sm="8">Peso Extra</CCol>
                                    <CCol sm="4">{
                                        props.cotizacionPedidoData.pesoExtra !== null && props.cotizacionPedidoData.pesoExtra !== "" ?
                                            `Q${(props.cotizacionPedidoData.pesoExtra).toFixed(2)}` :
                                            '-'
                                    }</CCol>
                                </CRow>
                                <CRow className="card-values-conecta">
                                    <CCol sm="8">Costo de envio</CCol>
                                    <CCol sm="4">{
                                        props.cotizacionPedidoData.costoEnvio !== null && props.cotizacionPedidoData.costoEnvio !== "" ?
                                            `Q${(props.cotizacionPedidoData.costoEnvio).toFixed(2)}` :
                                            '-'
                                    }</CCol>
                                </CRow>
                                <CRow style={{ borderBottom: '2px solid #153b75' }}>
                                </CRow>

                                <CRow className="card-values-conecta">
                                    <CCol sm="8">Descuento Cupon</CCol>
                                    <CCol sm="4">{
                                        props.cotizacionPedidoData.cupon !== null && props.cotizacionPedidoData.cupon !== "" ?
                                            `Q${(props.cotizacionPedidoData.cupon).toFixed(2)}` :
                                            '-'
                                    }</CCol>
                                </CRow>

                                <CRow style={{ borderBottom: '2px solid #153b75' }}>
                                </CRow>
                                <CRow className="card-values-conecta">
                                    <CCol sm="8">Total</CCol>
                                    <CCol sm="4">{

                                        props.cotizacionPedidoData.total !== null && props.cotizacionPedidoData.total !== "" ?
                                            `Q${(props.cotizacionPedidoData.total).toFixed(2)}` :
                                            '-'
                                    }</CCol>
                                </CRow>
                                <CRow className="card-values-conecta" style={{ display: (props.data.cupon !== null && props.data.cupon !== "") ? 'flex' : 'none' }}>
                                    <CCol sm="4">Cupon</CCol>
                                    <CCol sm="6">{cupon_text}</CCol>
                                    <CCol sm="1" style={{ display: (props.data.cupon !== null && props.data.cupon !== "") ? 'flex' : 'none' }}>
                                        <CButton onClick={eliminarCodigoCupon} className="btn btn-primary">
                                            x
                                        </CButton>
                                    </CCol>
                                </CRow>
                            </CCol>
                        </CRow>
                        <CRow>

                        </CRow>
                    </CCardBody>
                </CCard>

                <div className="creacion-pedido-button-envio">
                    <CRow className="mb-4">
                        <CCol sm="4">
                            <CRow className="buttons-back">
                                <button
                                    type="button"
                                    className="btn btn-danger btn-circle btn-xl"
                                    style={{ backgroundColor: '#bfc7d8' }}
                                    onClick={
                                        () => {
                                            props.changeStep(0);
                                        }
                                    }
                                >
                                    <CIcon
                                        style={{
                                            color: 'white',
                                            width: '2rem',
                                            height: '2rem',
                                            fontSize: '2rem',
                                            transform: 'rotate(180deg)'
                                        }}
                                        name="cil-arrow-right"
                                    />
                                </button>
                                <label className="back">
                                    Anterior
                                </label>
                            </CRow>
                        </CCol>
                        <CCol sm="4">
                        </CCol>
                        <CCol sm="4">
                            <CRow className="buttons-next">
                                <label className="next">
                                    Siguiente
                                </label>
                                <button
                                    type="button"
                                    className="btn btn-danger btn-circle btn-xl"
                                    onClick={nextStep}
                                >
                                    <CIcon
                                        style={{ color: 'white', width: '2rem', height: '2rem', fontSize: '2rem' }}
                                        name="cil-arrow-right"
                                    />
                                </button>
                            </CRow>
                        </CCol>
                    </CRow>
                </div>
            </> : null
    )
}

const Step3 = (props) => {
    const inputFile = useRef(null)
    const [valor, setValor] = useState(0);
    const { addToast } = useToasts();

    const DEFAULT_MAX_FILE_SIZE_IN_BYTES = 500000;
    const KILO_BYTES_PER_BYTE = 1000;

    const convertBytesToKB = (bytes) =>
        Math.round(bytes / KILO_BYTES_PER_BYTE);

    const handleNewFileUpload = (e) => {
        const { files: newFiles } = e.target;
        if (newFiles.length) {
            props.setFiles({ img: URL.createObjectURL(e.target.files[0]), file: e.target.files[0] });
        }
    };


    const handleChange = (e) => {
        const { id, value } = e.target;
        let bool_value;
        if (value === 'true') {
            bool_value = false;
        } else if (value === 'false') {
            bool_value = true;
        } else {
            bool_value = value;
        }

        switch (id) {
            case 'efectivo-pago':

                props.setCobro({
                    transferencia: false,
                    contra_entrega: false,
                    efectivo: bool_value
                });

                break
            case 'transferencia-pago':
                props.setCobro({
                    efectivo: false,
                    contra_entrega: false,
                    transferencia: bool_value
                });
                break
            case 'contra-entrega-pago':
                props.setCobro({
                    efectivo: false,
                    transferencia: false,
                    contra_entrega: bool_value
                });
                break
            default: ;
        }
    }

    const nextStep = () => {
        let pago = props.cobro;
        if (!pago.efectivo && !pago.transferencia && !pago.contra_entrega) {
            addToast(`Tiene que añadir un metodo de pago para continuar`, {
                appearance: 'error',
                autoDismiss: true,
                autoDismissTimeout: 4000
            });
            return false;
        }

        if (document.getElementById("file").files.length == 0 && (pago.transferencia)) {
            addToast(`Debe adjuntar un archivo`, {
                appearance: 'error',
                autoDismiss: true,
                autoDismissTimeout: 4000
            });
            return false;
        }

        props.changeStep(3);
    }

    useEffect(() => {
        let value = 0.00;
        if (props.rows_data) {
            if (props.rows_data.length > 0) {
                props.rows_data.forEach((elem, index) => {
                    value += parseFloat(elem.precio);
                })
                let seguro = 0;
                let cupon = 0;

                if (props.seguro.value !== '' && props.seguro.value !== 0) {
                    seguro = parseFloat(props.seguro);
                }
                if (props.cupon.value !== '' && props.cupon.value !== 0) {
                    cupon = parseFloat(props.cupon);
                }
                value = value + seguro;
                value = value - cupon;
                setValor(value.toFixed(2));
            } else {
                setValor(0);
            }
        }
    }, [])

    useEffect(() => {

    }, [inputFile])


    return (
        <>
            <div className="creacion-pedido-progress-bar">
                <CRow>
                    <CCol sm="9">
                    </CCol>
                    <CCol sm="3">
                        <div className="wrap">
                            <ul id="progressbar">
                                <li className="active" id="first"><strong></strong></li>
                                <li className="active" id="second"><strong></strong></li>
                                <li className="active" id="third"><strong></strong></li>
                            </ul>
                        </div>
                    </CCol>
                </CRow>
            </div>

            <CCard className="creacion-pedido-card creacion-pedido-step3">
                <CCardBody className="card-body">
                    <CRow>
                        <CCol sm="5">
                            <div className="card-title">
                                <h3>Resumen</h3>
                            </div>

                        </CCol>
                    </CRow>
                    <br />
                    <CRow className="data-info-client-header mb-1">
                        <CCol sm="5">
                            <CRow >
                                <h5 className="text-left-number-order-key">No. de Orden: </h5>&nbsp; &nbsp;
                                <h5 className="text-left-number-order-value"> 12345678</h5>
                            </CRow>
                        </CCol>
                        <CCol sm="7">
                            <CRow className="paquetes-number mr-2">
                                <h5 className="text-left-number-order-key">No. de paquetes: &nbsp; &nbsp;</h5>
                                <h5 className="text-left-number-order-value">{props.rows_data.length}</h5>
                            </CRow>
                        </CCol>
                    </CRow>

                    <CRow className="data-info-client mb-4">
                        <CCol sm="12">
                            <CRow>
                                <p style={{ fontWeight: '600' }}>Envia: &nbsp;</p>
                                <p style={{ fontWeight: '600' }}> {props.data.nombre_empresa_remitente}</p>
                            </CRow>
                            <CRow>
                                <p>Contacto: &nbsp;</p>
                                <p>{props.data.remitente}</p>
                            </CRow>
                            <CRow>
                                <p>Correo Electronico: &nbsp;</p>
                                <p>{props.data.correo_remitente}</p>
                            </CRow>
                            <CRow>
                                <p>Telefono: &nbsp;</p>
                                <p>{props.data.telefono_remitente}</p>
                            </CRow>
                            <CRow>
                                <p>Direccion: &nbsp;</p>
                                <p>{props.data.direccion_remitente}</p>
                            </CRow>
                        </CCol>
                    </CRow>

                    <CRow className="data-info-client mb-4">
                        <CCol sm="12">
                            <CRow>
                                <p style={{ fontWeight: '600' }}>Recibe: &nbsp;</p>
                                <p style={{ fontWeight: '600' }}> {props.data.name_destinatario}</p>
                            </CRow>
                            <CRow>
                                <p>Contacto: &nbsp;</p>
                                <p>{props.data.destinatario}</p>
                            </CRow>
                            <CRow>
                                <p>Correo Electronico: &nbsp;</p>
                                <p>{props.data.correo_destinatario}</p>
                            </CRow>
                            <CRow>
                                <p>Telefono: &nbsp;</p>
                                <p>{props.data.telefono_destinatario}</p>
                            </CRow>
                            <CRow>
                                <p>Direccion: &nbsp;</p>
                                <p>{props.data.direccion_destinatario}</p>
                            </CRow>
                        </CCol>
                    </CRow>

                    <CRow className="separate-row mb-4"></CRow>

                    <CRow className="data-info-client-price mb-4">
                        <CCol sm="12">
                            <CRow className="price-underline">
                                <p className="price-label" >
                                    Precio del Servicio: &nbsp;
                                </p>
                                <p className="price">
                                    {props.consto_de_envio_text_cotiza}
                                </p>
                            </CRow>
                        </CCol>
                        <CCol sm="6">
                            <CRow className="text-price">
                                <p>Nuestras entregas en ciudad capital y zonas aledañas es menos de 5 horas bajo cobertura.
                                    <br />
                                    <br />
                                    Las entregas al interior se realizan entre 24 a 72 horas bajo cobertura.</p>
                            </CRow>
                        </CCol>
                    </CRow>

                    <CRow className="separate-row mb-4"></CRow>

                    <CRow className="mb-3">
                        <CCol sm="5">
                            <div className="card-title">
                                <h3>Cobro del envío</h3>
                            </div>
                        </CCol>
                    </CRow>

                    <CRow className="pills-pago">
                        <CCol sm="3">
                            <CRow className="switch-container">
                                <p className="text-pago">Efectivo al Recolectar</p>
                                <label className="switch">
                                    <input type="checkbox" onChange={handleChange} checked={props.cobro.efectivo} value={props.cobro.efectivo} id="efectivo-pago" disabled={props.cobro.contra_entrega ? true : false} />
                                    <div className="slider round">
                                        <span className="on">Si</span>
                                        <span className="off">no</span>
                                    </div>
                                </label>
                            </CRow>
                        </CCol>
                        <CCol sm="5">
                            <CRow className="switch-container">
                                <p className="text-pago">Transferencia Bancaria</p>
                                <label className="switch">
                                    <input type="checkbox" onChange={handleChange} checked={props.cobro.transferencia} value={props.cobro.transferencia} id="transferencia-pago" disabled={props.cobro.contra_entrega ? true : false} />
                                    <div className="slider round">
                                        <span className="on">Si</span>
                                        <span className="off">no</span>
                                    </div>
                                </label>
                            </CRow>
                        </CCol>
                        <CCol sm="4">
                            <CRow className="switch-container">
                                <p className="text-pago">Pago contra entrega</p>
                                <label className="switch">
                                    <input type="checkbox" onChange={handleChange} checked={props.cobro.contra_entrega} value={props.cobro.contra_entrega} id="contra-entrega-pago" />
                                    <div className="slider round">
                                        <span className="on">Si</span>
                                        <span className="off">no</span>
                                    </div>
                                </label>
                            </CRow>
                        </CCol>
                    </CRow>

                    <CRow className="data-info-client-conecta mb-4" style={{ display: (props.cobro.transferencia) ? 'flex' : 'none' }}>
                        <CCol sm="6" className="mt-5">
                            <CRow>
                                <p className="info" >
                                    No. de cuenta: &nbsp;
                                </p>
                            </CRow>
                            <CRow>
                                <p className="info">
                                    903411890
                                </p>
                            </CRow>
                            <CRow>
                                <p className="info">
                                    BAC - Monetaria
                                </p>
                            </CRow>
                            <CRow>
                                <p className="info">
                                    AIM Digital de Guatemala S.A.
                                </p>
                            </CRow>
                        </CCol>
                        <CCol sm="6" className="mt-5 pt-4 button-vaucher">
                            <CRow>
                                <CCol sm="3" className="mb-3"></CCol>
                                <CCol sm="6" xl className="mb-3">
                                    <CRow> <CButton
                                        block color="secondary"
                                        style={{ fontSize: '1.2rem' }}
                                        onClick={() => {
                                            // `current` points to the mounted file input element
                                            inputFile.current.click();
                                        }}
                                    >Subir voucher</CButton> </CRow>
                                    <CRow style={{
                                        display: 'block',
                                        marginLeft: 'auto',
                                        marginRight: 'auto',
                                        textAlign: 'center'
                                    }}>{(inputFile !== null) ?
                                        (inputFile.current !== null) ?
                                            (inputFile.current.files !== undefined) ?
                                                (inputFile.current.files[0] !== undefined) ?
                                                    inputFile.current.files[0].name : '' : '' : '' : ''}</CRow>
                                </CCol>
                                <input onChange={handleNewFileUpload} type='file' id='file' ref={inputFile} accept="image/png, image/jpeg, image/jpg" style={{ display: 'none' }} />
                                <CCol sm="3" className="mb-3"></CCol>
                            </CRow>
                        </CCol>
                    </CRow>

                </CCardBody>
            </CCard>

            <div className="creacion-pedido-button-envio">
                <CRow className="mb-4">
                    <CCol sm="4">
                        <CRow className="buttons-back">
                            <button
                                type="button"
                                className="btn btn-danger btn-circle btn-xl"
                                style={{ backgroundColor: '#bfc7d8' }}
                                onClick={
                                    () => {
                                        props.changeStep(1);
                                    }
                                }
                            >
                                <CIcon
                                    style={{
                                        color: 'white',
                                        width: '2rem',
                                        height: '2rem',
                                        fontSize: '2rem',
                                        transform: 'rotate(180deg)'
                                    }}
                                    name="cil-arrow-right"
                                />
                            </button>
                            <label className="back">
                                Anterior
                            </label>
                        </CRow>
                    </CCol>
                    <CCol sm="4">
                    </CCol>
                    <CCol sm="4">
                        <CRow className="buttons-next">
                            <label className="next" style={{ fontSize: '1.3rem' }}>
                                Finalizar Orden
                            </label>
                            <button
                                type="button"
                                className="btn btn-danger btn-circle btn-xl"
                                // onClick={nextStep}
                                onClick={props.createOrder}
                            >
                                <CIcon
                                    style={{ color: 'white', width: '2rem', height: '2rem', fontSize: '2rem' }}
                                    name="cil-arrow-right"
                                />
                            </button>
                        </CRow>
                    </CCol>
                </CRow>
            </div>
        </>
    )
}

const Step4 = (props) => {
    const inputFile = useRef(null)
    const [valor, setValor] = useState(0);
    const [url, setUrl] = useState("");
    const { addToast } = useToasts();
    const history = useHistory();

    useEffect(() => {
        let value = 0.00;
        if (props.rows_data) {
            if (props.rows_data.length > 0) {
                props.rows_data.forEach((elem, index) => {
                    value += parseFloat(elem.precio);
                })
                setValor(value);
            } else {
                setValor(0);
            }
        }
        let getUrl = window.location;
        let baseUrl = getUrl.protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];
        let new_url = `${baseUrl}#/tracking/${props.pedido}`;
        setUrl(new_url);
    }, [])


    useEffect(() => {
        // const user_object = reactLocalStorage.getObject('user');
        // if (user_object === 'undefined' || user_object === undefined || user_object === null || Object.keys(user_object).length === 0) {
        //     reactLocalStorage.remove('user');
        //     history.push('/login');
        //     return false;
        // }
        // axios({
        //     method: 'post',
        //     url: `https://ws.conectaguate.com/api/v1/site/pedido/img/add/${props.pedido_id}`,
        //     headers: {
        //         'Authorization': `Bearer ${user_object.token}`
        //     },
        //     data: props.files
        // }).then((response) => {

        // }, (error) => {
        //     addToast(`Intente mas tarde`, {
        //         appearance: 'error',
        //         autoDismiss: true,
        //         autoDismissTimeout: 4000
        //     });
        // });
    }, [])


    return (
        <>
            <CContainer className="creacion-pedido-step4">
                <CRow className="title-container">
                    <h3 className="title">Orden Finalizada</h3>
                </CRow>
                <CRow className="subtitle-container">
                    Favor descarga esta guía y pegala en tu paquete
                </CRow>
                <br />
                <CRow className="subtitle-container">
                    <CButton block color="primary"
                        onClick={() => {
                            props.descargarGuia(props.pedido);
                        }}
                    >
                        Descargar guía
                    </CButton>
                </CRow>
                <br />
                <CRow className="subtitle-container-info">
                    Puedes compartir el siguiente tracking con tu cliente para manterle informado del estado de su pedido.
                </CRow>
                <br />
                <CRow className="link-pedido">
                    <a href={url} target={"_blank"}>{props.pedido}</a>
                </CRow>
                <br />
                <CRow className="recomendaciones-container">
                    <CCol sm="6">
                        <p className="title">Recomendaciones de embalaje</p>
                        <ul>
                            <li>
                                Recuerda embalar bien tus productos de preferencia sellados dentro de una caja.
                            </li>
                            <li>
                                Si es frágil, añadele una etiqueta y rellenalo con duroport, esponja o cartón a manera de proteger tu producto.
                            </li>
                            <li>
                                Si envías galones, botellas o frascos, deberás embalarlos dentro de una caja de preferencia envueltos en plástico.
                            </li>
                        </ul>
                    </CCol>
                    <CCol sm="6">
                        <CImg
                            src={"img/hero/embalaje.png"}
                            className="d-inline-block img-fluid embalaje-hero"
                            alt="embalaje conecta"
                        />
                    </CCol>
                </CRow>
                <br />
                <CRow className="button-again">
                    <CButton block style={{ backgroundColor: '#e9f114', color: '#153b75' }}
                        onClick={() => {
                            props.changeStep(0);
                        }}
                    >Realizar más envíos</CButton>
                </CRow>
                <br />
            </CContainer>
        </>
    )
}



const RowPackageStatic = (props) => {
    const [new_package, setPackage] = useState(props.data);
    const [accordion, setAccordion] = useState(1)
    const [collapse, setCollapse] = useState(false)

    const toggle = (e) => {
        setCollapse(!collapse)
        e.preventDefault()
    }

    const deletePackage = (id) => {
        let allRows = [...props.rows];

        // let newRows = allRows.filter(elem => elem.id !== id);
        // let newRows; 

        for (var i = 0; i < allRows.length; i++) {
            var obj = allRows[i];

            if (id === obj.id) {
                allRows.splice(i, 1);
                i--;
            }
        }
        props.setRows(allRows);

    }

    return (
        <>
            <CCard className="mb-0">
                <CCardHeader id="headingOne">
                    <CButton
                        block
                        className="text-left m-0 p-0"
                        onClick={() => setAccordion(accordion === 0 ? null : 0)}
                        style={{ color: '#153b75', fontWeight: '600' }}
                    >
                        <h5 className="m-0 p-0" style={{ color: '#153b75', fontWeight: '600' }}>Paquete # {props.number + 1}</h5>
                    </CButton>
                </CCardHeader>
                <CCardBody style={{ display: (accordion === 0) ? 'block' : 'none', paddingTop: '0' }}>
                    <CCollapse show={accordion === 0}>
                        <CRow className="row-package">
                            <CCol sm="3">
                                <CRow>
                                    <div className="card-title-column">
                                        Descripción
                                    </div>
                                </CRow>
                                <CRow>
                                    <CInput type="text" id="paquete" className="card-input" disabled value={new_package.paquete} placeholder="" style={{ background: 'white', border: '0px' }} />
                                </CRow>
                            </CCol>
                            <CCol sm="2">
                                <CRow>
                                    <div className="card-title-column">
                                        Tipo de transporte<div className="asterisk">&nbsp;*</div>
                                    </div>
                                </CRow>
                                <CRow>
                                    <CInput type="text" id="transporte" className="card-input" disabled value={props.tipos_de_transporte[new_package.transporte].nombre} placeholder="" style={{ background: 'white', border: '0px' }} />
                                </CRow>
                            </CCol>
                            <CCol sm="2">
                                <CRow>
                                    <div className="card-title-column">
                                        Peso<div className="asterisk">&nbsp;*</div>
                                    </div>
                                </CRow>
                                <CRow>
                                    <CInput min="0" type="number" id="peso" className="card-input" disabled value={new_package.peso} placeholder="" style={{ background: 'white', border: '0px' }} />
                                </CRow>
                            </CCol>
                            <CCol sm="2">
                                <CRow>
                                    <div className="card-title-column">
                                        Valor declarado<div className="asterisk">&nbsp;*</div>
                                    </div>
                                </CRow>
                                <CRow>
                                    <CInput min="0" type="number" id="precio" className="card-input" disabled value={new_package.precio} placeholder="" style={{ background: 'white', border: '0px' }} />
                                </CRow>
                            </CCol>
                            <CCol sm="2">
                                <CRow>
                                    <div className="card-title-column">
                                        Fragil<div className="asterisk">&nbsp;*</div>
                                    </div>
                                </CRow>
                                <CRow className="slider-fragil">
                                    <CSwitch
                                        className={'mx-1'}
                                        variant={'3d'}
                                        color={'success'}
                                        id="fragil"
                                        checked={(new_package.fragil === 'on') ? true : false}
                                        value={new_package.fragil}
                                        disabled />
                                </CRow>
                            </CCol>
                            <CCol sm="1">
                                <CRow>
                                    <div className="card-title-column">
                                        &nbsp;
                                    </div>
                                </CRow>
                                <CRow className="slider-fragil" onClick={() => {
                                    deletePackage(props.data.id)
                                }}
                                    style={{ cursor: 'pointer', width: 'fit-content' }}
                                >
                                    <CIcon
                                        style={{ color: 'red', width: '1.5rem', height: '1.5rem', fontSize: '1.5rem', cursor: 'pointer' }}
                                        name="cil-x-circle"
                                    />
                                </CRow>
                            </CCol>
                        </CRow>
                    </CCollapse>
                </CCardBody>
            </CCard>
        </>
    )
}


const RowPackage = (props) => {
    const { addToast } = useToasts();
    const [check, setCheck] = useState(false);
    const [new_package, setPackage] = useState({
        paquete: '',
        transporte: '',
        peso: '',
        precio: '',
        fragil: 'off',
        id: ''
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        if (value < 0) return false
        const form_object = JSON.parse(JSON.stringify(new_package));
        let new_data = {
            ...form_object,
            [id]: value
        };
        setPackage(new_data);
    }

    const clickSwitch = () => {
        let value_switch;
        if (check) {
            value_switch = false;
            setCheck(false);
        } else {
            value_switch = true;
            setCheck(true);
        }
        const form_object = JSON.parse(JSON.stringify(new_package));
        let new_data = {
            ...form_object,
            fragil: (value_switch) ? 'on' : 'off'
        };
        setPackage(new_data);

    }

    const submitRow = () => {
        let clone_objects = [...props.rows];
        let labels = {
            paquete: 'Paquete',
            transporte: 'Transporte',
            peso: 'Peso',
            precio: 'Precio',
            id: 'id'
        }
        let error = false;
        for (const [key, value] of Object.entries(new_package)) {
            if (value.length === 0 && key !== 'id') {
                addToast(`El campo ${labels[key]} es requerido`, {
                    appearance: 'error',
                    autoDismiss: true,
                    autoDismissTimeout: 4000
                });
                error = true;
            }
        }
        if (error) {
            return false;
        }

        if (parseInt(new_package.peso) > 25 && new_package.transporte === 'Moto') {
            addToast(`El tipo de transporte elegido no es ideal para 
                      transportar su producto, puede tener algún recargo 
                      o problema al momento de la recolecta`, {
                appearance: 'warning',
                autoDismiss: true,
                autoDismissTimeout: 4000
            });
            // error = true;
        }

        if (error) {
            return false;
        }
        let paquete_con_id = JSON.parse(JSON.stringify(new_package));
        const new_id = uuidv4();
        paquete_con_id.id = new_id;

        clone_objects.push(paquete_con_id);
        props.addRow(clone_objects);
        setPackage({
            paquete: '',
            transporte: '',
            peso: '',
            precio: '',
            fragil: 'off',
            id: ''
        });
        setCheck(false);
    }

    return (
        <>
            <CRow className="row-package">
                <CCol sm="3">
                    <CRow>
                        <div className="card-title-column">
                            Descripción
                        </div>
                    </CRow>
                    <CRow>
                        <CInput
                            type="text"
                            id="paquete"
                            className="card-input"
                            onChange={handleChange}
                            value={new_package.paquete}
                            placeholder="Un paquete con"
                            style={{ background: 'white', border: '0px' }}
                        />
                    </CRow>
                </CCol>
                <CCol sm="2">
                    <CRow>
                        <div className="card-title-column">
                            Tipo de transporte<div className="asterisk">&nbsp;*</div>
                        </div>
                    </CRow>
                    <CRow>
                        <select
                            id="transporte"
                            className="card-input"
                            onChange={handleChange}
                            value={new_package.transporte}
                            placeholder=""
                            style={{ background: 'white', border: '0px', color: '#768192' }}
                        >
                            <option value="">Tipo</option>
                            {Object.entries(props.tipos_de_transporte).map((elem, index) => {
                                return <option value={elem[1].id} key={`${elem[1].id}-${index}`}>{elem[1].nombre}</option>
                            })}
                        </select>
                    </CRow>
                </CCol>
                <CCol sm="2">
                    <CRow>
                        <div className="card-title-column">
                            Peso<div className="asterisk">&nbsp;*</div>
                        </div>
                    </CRow>
                    <CRow>
                        <div className="input-box">
                            <CInput
                                type="number"
                                id="peso"
                                className="card-input"
                                onChange={handleChange}
                                value={new_package.peso}
                                placeholder=""
                                style={{
                                    background: 'white',
                                    border: '0px',
                                }}
                                min="0"
                            />
                            <span className="prefix">Lbs</span>
                        </div>
                    </CRow>
                </CCol>
                <CCol sm="2">
                    <CRow>
                        <div className="card-title-column">
                            Valor declarado<div className="asterisk">&nbsp;*</div>
                        </div>
                    </CRow>
                    <CRow>
                        <div className="input-box">
                            <span className="prefix">Q</span>
                            <CInput
                                type="number"
                                id="precio"
                                className="card-input"
                                onChange={handleChange}
                                value={new_package.precio}
                                placeholder=""
                                style={{ background: 'white', border: '0px' }}
                            />
                        </div>

                    </CRow>
                </CCol>
                <CCol sm="2">
                    <CRow>
                        <div className="card-title-column">
                            Fragil<div className="asterisk">&nbsp;*</div>
                        </div>
                    </CRow>
                    <CRow>
                        <CSwitch
                            onChange={clickSwitch}
                            className={'mx-1'}
                            variant={'3d'}
                            color={'success'}
                            id="fragil"
                            checked={check}
                        />
                    </CRow>
                </CCol>
                <CCol sm="1">
                    <CRow>
                        <div className="card-title-column">
                            &nbsp;
                        </div>
                    </CRow>
                    <CRow>
                        {/* <CIcon 
                            style={{color: 'red', width: '1.5rem', height: '1.5rem', fontSize: '1.5rem'}}
                            name="cil-x-circle" 
                        /> */}
                    </CRow>
                </CCol>
            </CRow>

            <CRow className="mt-3">
                <CCol col="9" sm="9" md="9">

                </CCol>
                <CCol col="3" sm="3" md="3">
                    <CCol xl className="mb-3 mb-xl-0">
                        <CButton block shape="pill"
                            className=""
                            style={{
                                backgroundColor: "#4F6CBC",
                                border: "1px solid #4F6CBC",
                                color: "white"
                            }}
                            onClick={submitRow}
                        >agregar paquete</CButton>
                    </CCol>
                </CCol>
            </CRow>
        </>
    )
}


export default CreacionPedido
