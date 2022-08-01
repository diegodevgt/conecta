import React from 'react'
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CContainer,
    CJumbotron,
    CRow,
    CImg
  } from '@coreui/react'
  import { useHistory } from "react-router-dom";
  import { AnimationOnScroll } from 'react-animation-on-scroll';

function Sales(props) {
    const history = useHistory();
    return (
       <>
            <CRow className="home-sales">
                    <CCol lg="6">
                        <CRow 
                            className="align-items-center" 
                            style={{
                                width:'100%',
                                height: '90%',
                                marginRight: '0',
                                marginLeft: '0'
                            }}>
                            <CCol>
                            </CCol>
                            <CCol lg="9">
                                <CRow>
                                    <CCol>
                                        <AnimationOnScroll animateOnce={true} animateIn="animate__fadeInLeftBig" duration={1}>
                                            <h3 className="title">
                                                Aumenta <br/> tus ventas
                                            </h3>
                                        </AnimationOnScroll>
                                    </CCol>
                                </CRow>
                                <CRow>
                                    <CCol className="body">
                                        <AnimationOnScroll animateOnce={true} animateIn="animate__fadeInLeftBig" duration={1}>
                                            Con envios a toda Guate aumentarás tus 
                                            ventas. Además con nuestro marketplace
                                            automatizado llegarás a más personas.
                                        </AnimationOnScroll>
                                    </CCol>
                                </CRow>
                                <CRow>
                                    <CCol className="cta">
                                        <CButton className="button" onClick={(e)=>{
                                            e.preventdefault()
                                            history.push('/mensajeria-corporativa');
                                        }}  type="submit" size="lg" color="secondary">Ver más</CButton>
                                    </CCol>
                                </CRow>
                            </CCol>
                            <CCol>
                            </CCol>
                        </CRow>
                    </CCol>
                    <CCol lg="6" className="sales-image-hero">
                        <AnimationOnScroll animateOnce={true} animateIn="animate__fadeInRightBig" duration={1}>
                            <CImg
                                src={"img/hero/office-background-blue.png"}
                                className="d-inline-block img-fluid"
                                alt="ventas conecta"
                            />
                        </AnimationOnScroll>
                    </CCol>
            </CRow>
       </>
    )
}


export default Sales

