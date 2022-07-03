import React, { lazy, Fragment, useState, useEffect, useRef} from 'react'
import {isMobile} from 'react-device-detect';
import {
    CBadge,
    CButton,
    CButtonGroup,
    CCard,
    CCardBody,
    CCardFooter,
    CCardHeader,
    CCol,
    CProgress,
    CRow,
    CJumbotron,
    CImg,
    CInput,
    CSelect,
    CContainer
  } from '@coreui/react'


import { FileUploader } from "react-drag-drop-files";
import VideoComponentCrossSelling from './VideoComponentCrossSelling';
import CIcon from '@coreui/icons-react';
import Modal from 'react-modal';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'
import {reactLocalStorage} from 'reactjs-localstorage';
import { useToasts } from 'react-toast-notifications';
import { useHistory } from "react-router-dom";
import axios from 'axios';

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

  const fileTypes = ["JPG", "PNG"];

  Modal.setAppElement('#root');

function CrossSelling(props) {
    const inputFile = useRef(null) 
    const [modalIsOpen, setIsOpen] = useState(false);
    const [data_cross_selling, setDataCrossSelling] = useState([]);
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState("");
    const [link, setLink] = useState("");
    const [update_data, setUpdateData] = useState(0);
    const { addToast } = useToasts();
    const history = useHistory();


    useEffect(()=>{
        const user_object = reactLocalStorage.getObject('user');
        
        let bearer = "";
        if(user_object === 'undefined' || user_object === undefined || user_object === null || Object.keys(user_object).length === 0){
            reactLocalStorage.remove('user');
            history.push('/login');
        }else{  
            bearer =  `Bearer ${user_object.token}`;
        }

        axios({
            method: 'get',
            url: 'https://ws.conectaguate.com/api/v1/site/cross',
            headers: { 
                'Authorization': bearer,
                'Content-Type': 'application/json'
            },
        }).then((response_items)=>{
            console.log(response_items);
            let data_items = response_items.data["Data"];
            let new_array = [];
            data_items.forEach((item) => {
                let data_obj = {};
                if(item.img !== null){
                    data_obj = {
                        id: item.id,
                        img: item.img,
                        link: item.link,
                        title: item.link
                    }
                    new_array.push(data_obj);
                }
            })
            setDataCrossSelling(new_array);
            console.log(new_array);
            console.log(update_data);
        });
    },[file, update_data])


    const createNewProduct = async () =>{
        const user_object = reactLocalStorage.getObject('user');
        
        let bearer = "";
        if(user_object === 'undefined' || user_object === undefined || user_object === null || Object.keys(user_object).length === 0){
            reactLocalStorage.remove('user');
            history.push('/login');
        }else{  
            bearer =  `Bearer ${user_object.token}`;
        }
        
        let data_producto = {
            producto_nombre: title, 
            producto_link: link
        };
        

        await axios({
            method: 'post',
            url: 'https://ws.conectaguate.com/api/v1/site/cross/item/storage',
            headers: { 
                'Authorization': bearer,
                'Content-Type': 'application/json'
            },
            data: data_producto
        }).then(async (response)=>{
            let formData = new FormData();
            formData.append("producto_imagen", file);

            
            await axios({
                method: 'post',
                url: `https://ws.conectaguate.com/api/v1/site/cross/item/img/${response.data["Data"].id}`,
                headers: { 
                    'Authorization': bearer,
                    'Content-Type': 'application/json'
                },
                data: formData
            }).then((response_2)=>{
                setFile(null);
                setLink("");
                setTitle("");
                console.log(response_2);
            }).catch((e)=>{
                console.log(e.message);
            });
        }).catch((e)=>{
            console.log(e.message);
        });
    }

    const deleteProduct = async(id) =>{
        const user_object = reactLocalStorage.getObject('user');
        
        let bearer = "";
        if(user_object === 'undefined' || user_object === undefined || user_object === null || Object.keys(user_object).length === 0){
            reactLocalStorage.remove('user');
            history.push('/login');
        }else{  
            bearer =  `Bearer ${user_object.token}`;
        }

        await axios({
            method: 'delete',
            url: `https://ws.conectaguate.com/api/v1/site/cross/delete/${id}`,
            headers: { 
                'Authorization': bearer,
                'Content-Type': 'application/json'
            }
        }).then(async (response)=>{
            console.log(response); 
            let num = update_data + 1;
            setUpdateData(num);
        }).catch((e)=>{
            console.log(e.message);
        });
       
    }


    const updateDataCrossSelling = ( ) =>{
        if( file === null ){
            addToast('Debe subir una imagen', { 
                appearance: 'error', 
                autoDismiss : true ,
                autoDismissTimeout : 3000
            });
            return false;
        }
        if( title === "" ){
            addToast('Titulo no valido', { 
                appearance: 'error', 
                autoDismiss : true ,
                autoDismissTimeout : 3000
            });
            return false;
        }
        if( link === "" ){
            addToast('Link no valido', { 
                appearance: 'error', 
                autoDismiss : true ,
                autoDismissTimeout : 3000
            });
            return false;
        }

        createNewProduct();
        closeModal();
        addToast('Producto agregado exitosamente', { 
            appearance: 'success', 
            autoDismiss : true ,
            autoDismissTimeout : 3000
        });
    }

    const handleChange = (e) =>{
        const { value, name } = e.target;
        switch(name){
            case 'title':
                setTitle(value);
                break;
            case 'link':
                setLink(value);
                break;    
            default: 
                break;
        }
    }


    function openModal() {
        setIsOpen(true);
    }
    
      function afterOpenModal() {
        // references are now sync'd and can be accessed.
        // subtitle.style.color = '#f00';
      }
    
    function closeModal() {
        setIsOpen(false);
    }

    const checkLink = (url) =>{
        let expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
        let regex = new RegExp(expression);
        if(url.match(regex)) return true;
        return false;
    }
    

    return (
        <>  
            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <CContainer style={{padding: '1rem'}}>
                    <CRow>
                        <CCol sm="12">
                        {/* Nombre
                        <CInput type='text' value=""/> */}
                            <CRow className=" mb-12" 
                                style={{
                                    marginTop: '.5rem',
                                    marginBottom: '1rem',
                                }}
                            >
                                {/* <CCol lg="1"></CCol> */}
                                <CCol className="col-md-auto">
                                    <h4 className="title-related-products" style={{fontWeight: '600'}}>
                                        Insertar imagen
                                    </h4>
                                </CCol>
                                {/* <CCol lg="1"></CCol> */}
                            </CRow>
                        </CCol>
                    </CRow>  
                    <CRow>
                        <CCol>
                            <DragDrop setFile={setFile}/>
                        </CCol>
                    </CRow> 
                    <CRow>
                        <CCol sm="12" style={{marginTop:'1rem'}}>
                            Titulo
                            <CInput value={title} onChange={handleChange} name="title" />
                        </CCol>
                    </CRow> 
                    <CRow>
                        <CCol sm="12" style={{marginTop:'1rem'}}>
                            Link de destino
                            <CInput value={link} onChange={handleChange} name="link" />
                        </CCol>
                    </CRow>
                    <CRow className="justify-content-md-right mb-3" style={{marginTop:'1rem', float:'right'}}>
                        <CCol sm="3">
                            <CButton type="submit" size="sm" color="secondary" onClick={()=>{
                                updateDataCrossSelling();  
                               
                            }}>
                                Agregar
                            </CButton>
                        </CCol>
                    </CRow>
                </CContainer>
            </Modal>
            <div className="cross-selling-container">
                <CRow>
                    <CCol sm="12">
                        <CCard className="card-header-2">
                            <div className="cross-selling-title">
                                Tu marca llega mas lejos
                            </div>
                        </CCard>    
                    </CCol>
                </CRow>  
                <CRow>
                    <CCol sm="12" className="title">
                        Conectamos con más clientes
                    </CCol>
                    <CCol sm="12" className="description">
                        La herramienta de cross selling, es un beneficio que te brindamos con el fin de que puedas alcanzar más clientes a traves de los envíos de Conecta Guate.
                        <br/>
                        <br/>
                        Al contar con el plan Premium tienes acceso a publicar imágenes de tus productos más aclamados.
                    </CCol>
                </CRow>
                <VideoComponentCrossSelling   />
                <CRow>
                    <CCol>
                        <CJumbotron className="border jumbotron-content">
                            <p className="lead">Empieza a disfrutar de los beneficios que ConectaGuate te 
                                ofrece, haz crecer tu negocio y hagamos que conectar Guatemala sea más fácil.</p>
                            <CRow>
                                <CCol >
                                    <CRow style={{float:'right'}}>
                                        <p className="lead plan">Cambiarme al plan</p>
                                        <CButton className="button-premium" color="primary" size="lg">
                                            <CImg 
                                                src={`img/icons/cross-selling/diamond.png`}
                                                className="diamond-button"
                                            />
                                            Premium
                                        </CButton>
                                    </CRow>
                                </CCol>
                            </CRow>
                        </CJumbotron>
                    </CCol>
                </CRow>
                <CRow>
                    {
                       
                        <CContainer className="products-cross-selling mt-5 mb-5">
                            <CRow className=" mb-4">
                                {/* <CCol lg="1"></CCol> */}
                                <CCol className="col-md-auto">
                                    <h4 className="title-related-products" style={{fontWeight: '600'}}>
                                        Productos
                                    </h4>
                                    <h5 style={{fontWeight: '400'}}>
                                        Arrastra tus productos estrella en esta sección.
                                    </h5>
                                </CCol>
                                {/* <CCol lg="1"></CCol> */}
                            </CRow>
            
                            <CRow className="justify-content-md-left mb-3">
                                {   
                                    data_cross_selling.map((elem, index)=>{
                                        if(index < 3){
                                            return <CardProduct elem={elem} update={index} deleteProduct={deleteProduct} key={`card_product_${index}`} />
                                        }
                                        return null;
                                    })
                                }      
                                {
                                    (data_cross_selling.length < 3) ?
                                    <CardProduct elem={'img/sliders/default.jpg'} update={openModal}  key={`card_product_default`} /> : null
                                }   
                            </CRow>
                            {
                                (data_cross_selling.length > 2 && data_cross_selling.length < 5) ?
                                <CRow className="justify-content-md-left mb-3">
                                    {   
                                        data_cross_selling.map((elem, index)=>{
                                            if(index > 2 && index < 5){
                                                return <CardProduct elem={elem} update={index} deleteProduct={deleteProduct} key={`card_product_${index}`} />
                                            }
                                            return null;
                                        })
                                    }      
                                    {
                                        (data_cross_selling.length < 5) ?
                                        <CardProduct elem={'img/sliders/default.jpg'} update={openModal} key={`card_product_2_${data_cross_selling.length}`} /> : null
                                    }   
                                    
                                </CRow>: null
                            }   
                        </CContainer>
                    }
                    
                </CRow>
                <CContainer>
                    <CRow className=" mb-4">
                        {/* <CCol lg="1"></CCol> */}
                        <CCol className="col-md-auto">
                            <h4 className="title-related-products" style={{fontWeight: '600'}}>
                            Vista Previa
                            </h4>
                            <h5 style={{fontWeight: '400'}}>
                                Arrastra tus productos estrella en esta sección.
                            </h5>
                        </CCol>
                        {/* <CCol lg="1"></CCol> */}
                    </CRow>
                </CContainer>
                {
                    (data_cross_selling.length > 0) ?
                    <CRow >
                        <CCol style={{height: '55vh'}}>
                            <MultipleSlidesExample data={data_cross_selling} />
                        </CCol>
                    </CRow>
                    : null 
                }
                <br/>
            </div>
        </>
    )
}

function DragDrop(props) {
    const handleChange = (file) => {
        props.setFile(file);
    };

    return (
      <FileUploader handleChange={handleChange} name="file"  types={fileTypes} />
    );
  }

function CrossSellingCarrousel(props){
    const {  update, deleteProduct} = props;
    const [ data , setData] = useState([]);

    useEffect(()=>{
        setData([]);
    },[])

    useEffect(()=>{
        setData(props.data);
        console.log("Data Change",props.data);
    },[props.data])

    return(
        <>
            <CContainer className="products-cross-selling mt-5 mb-5">
                <CRow className=" mb-4">
                    {/* <CCol lg="1"></CCol> */}
                    <CCol className="col-md-auto">
                        <h4 className="title-related-products" style={{fontWeight: '600'}}>
                            Productos
                        </h4>
                        <h5 style={{fontWeight: '400'}}>
                            Arrastra tus productos estrella en esta sección.
                        </h5>
                    </CCol>
                    {/* <CCol lg="1"></CCol> */}
                </CRow>

                <CRow className="justify-content-md-left mb-3">
                    {   
                        data.map((elem, index)=>{
                            if(index < 3){
                                return <CardProduct elem={elem} update={index} deleteProduct={deleteProduct} key={`card_product_${index}`} />
                            }
                            return null;
                        })
                    }      
                    {
                        (data.length < 3) ?
                        <CardProduct elem={'img/sliders/default.jpg'} update={update}  key={`card_product_default`} /> : null
                    }   
                </CRow>
                {
                    (data.length > 2 && data.length < 5) ?
                    <CRow className="justify-content-md-left mb-3">
                        {   
                            data.map((elem, index)=>{
                                if(index > 2 && index < 5){
                                    return <CardProduct elem={elem} update={index} deleteProduct={deleteProduct} key={`card_product_${index}`} />
                                }
                                return null;
                            })
                        }      
                        {
                            (data.length < 5) ?
                            <CardProduct elem={'img/sliders/default.jpg'} key={`card_product_2_${data.length}`} /> : null
                        }   
                        
                    </CRow>: null
                }   
            </CContainer>
        </>
    )
}



const CardProduct = (props) =>{
    const { elem } = props;
    const [ is_update, setUpdate ] = useState(false);
    const [ url_formed, setUrlFormed ] = useState('https://ws.conectaguate.com/');

    const openModal = () =>{
        props.update()
    }

    const deleteProduct = () =>{
        props.deleteProduct(elem.id);
    }

    useEffect(()=>{

        if(elem.img){
            setUrlFormed('https://ws.conectaguate.com/'+elem.img);
            setUpdate(true);
            console.log('https://ws.conectaguate.com/'+elem.img);
        }else{
            setUrlFormed(elem);
            setUpdate(false);
            console.log(elem);
        }

       
    },[props.elem]);
   
    return (
        <CCol xs="12" sm="4" md="3" style={{cursor: 'pointer'}} onClick={(is_update) ? ()=>{;} : openModal }>
            <CCard style={{border:'0px', paddingLeft:'1rem', paddingRight: '1rem'}}>
                <CCardHeader style={{
                    position:'absolute',
                    float:'right',
                    right: '0',
                    backgroundColor:'#ffffff00',
                    border: '0px solid',
                    top:'0',
                    marginTop:'-20px',
                }}> 
                {
                    (is_update) ? 
                    <CIcon name="cil-x" style={{color:'red', fontWeight:'bold',cursor: 'pointer'}}  onClick={deleteProduct} /> 
                    : null
                }
                </CCardHeader>
                <CCardBody className="background-image-card">
                    <CImg 
                        src={url_formed}
                        className="img-cross-selling"
                    />
                </CCardBody>
            </CCard>
        </CCol>
    );
}


const MultipleSlidesExample = ( props ) => {
    const { data } = props; 
  const style = {
    textAlign: 'center',
    padding: '10px 0',
    fontSize: '30px'
  };

  const properties = {
    duration: 500,
    slidesToShow: (data.length < 3) ? data.length : 3,
    slidesToScroll: 1,
    autoplay: false,
    indicators: true,
    responsive: [
        { breakpoint: 1200, settings: { slidesToShow: (data.length < 3) ? data.length : 3, slidesToScroll: 1 }},
        { breakpoint: 820, settings: { slidesToShow: (data.length < 3) ? data.length : 2, slidesToScroll: 1 }},
        { breakpoint: 0, settings: { slidesToShow: 1, slidesToScroll: 1 }},
    ]
  };

  return (
    <div>
      <div>
        <Slide {...properties}>
            {data.map((item, index)=>{

                let img_context = 'https://ws.conectaguate.com/'+item.img;
                return <div style={style}  key={`div_carrousel_${index}`}>
                        <CCard style={{
                                backgroundImage: `url("${img_context}")`,
                            }} 
                            key={`data_slide_${index}`}
                            className="cross-selling-image"
                            onClick={()=> window.open(item.link, "_blank", 'noopener,noreferrer')}>
                        </CCard>
                    </div>
            })}
        </Slide>
      </div>
    </div>
  );
};

export default CrossSelling

