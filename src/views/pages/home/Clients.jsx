import React from 'react'
import {
    CCol,
    CContainer,
    CRow,
    CImg
  } from '@coreui/react'
  import { AnimationOnScroll } from 'react-animation-on-scroll';


function Clients(props) {
    let row_clients_1 = ['logo-aquacity','logo-ciclon','logo-foodservice','logo-robo'];
    let row_clients_2 = ['logo-pcr','logo-impulso','logo-universales','logo-worx'];
    let row_clients_3 = [];
   
    
    return (
        <>
            <CContainer className="home-clients" id='clientesSatisfechos'>
                <CRow className="align-items-center">
                    <CCol>
                        <AnimationOnScroll animateOnce={true} animateIn="animate__fadeIn" duration={1}>
                            <h3 className="title">
                                Clientes Satisfechos
                            </h3>
                        </AnimationOnScroll>
                    </CCol>
                </CRow>
                <CRow className="align-items-center clients-sections">
                    <CRow className="align-items-center row-clients">
                        {row_clients_1.map((elem)=>{
                            return <SingleClient key={elem} img={elem}/>
                        })}
                    </CRow>
                    <CRow className="align-items-center row-clients">
                        {row_clients_2.map((elem)=>{
                            return <SingleClient key={elem} img={elem}/>
                        })}
                    </CRow>
                    <CRow className="align-items-center row-clients">
                        {row_clients_3.map((elem)=>{
                            return <SingleClient key={elem} img={elem}/>
                        })}
                    </CRow>
                </CRow>
                <CRow className="align-items-center">
                    <CCol>
                        <AnimationOnScroll animateOnce={true} animateIn="animate__fadeInLeftBig" duration={1}>
                            <h4 className="subtitle">
                                ...Y muchos emprendedores que conectan su negocio a toda Guatemala con nuestros servicios.
                            </h4>
                        </AnimationOnScroll>
                    </CCol>
                </CRow>
            </CContainer>
        </>
    )
}

const SingleClient = (props) => {
    const links = {
        'logo-aquacity': 'https://acqua-city.com/',
        'logo-ciclon': 'https://productosciclon.com/',
        'logo-foodservice': 'https://foodservice502.com.gt/',
        'logo-minegocioenlinea': 'https://minegocioenlinea.com/',
        'logo-pcr': 'https://www.ratingspcr.com/',
        'logo-regus': 'https://www.regus.com/en-us',
        'logo-universales': 'https://www.universales.com/',
        'logo-worx': 'https://www.worx.com/',
    }
    return (
        <CCol sm="3" className="container-client-img">
            { props.img != "" && (
                <CImg fluid
                    className="client-img"
                    src={`img/clients/${props.img}.png`}
                    onClick={(e)=>{
                        e.preventdefault()
                        window.open(links[props.img], '_blank').focus();
                    }}
                />
                )
            }
        </CCol>
    )
}

export default Clients

