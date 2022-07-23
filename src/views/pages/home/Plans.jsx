import React from 'react'
import { useHistory } from "react-router-dom";
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
import { bounceInLeft, fadeInUp } from 'react-animations';
import Radium, {StyleRoot} from 'radium';

function Plans(props) {
    const history = useHistory();
    const img1 = "img/icons/item-1.png";
    const img2 = "img/icons/item-2.png";
    const img3 = "img/icons/item-3.png";
    const title1 = "Fácil";
    const title2 = "Rápido";
    const title3 = "Te conectamos";

    const styles = {
        bounceInLeft: {
          animation: 'x 1s',
          animationName: Radium.keyframes(bounceInLeft, 'bounceInLeft')
        },
        fadeInUp:{
            animation: 'x 1s',
            animationName: Radium.keyframes(fadeInUp, 'fadeInUp')
        }
      }
    

    return (
        <>  
            <StyleRoot>
                <CContainer className="home-plans">
                    <CRow className="justify-content-md-center">
                        {/* <CCol lg="1"></CCol> */}
                        <CCol className="col-md-auto">
                            <h3 className="title" style={styles.bounceInLeft}>
                                Conectamos emociones y tu <br/> negocio a toda Guatemala
                            </h3>
                        </CCol>
                        {/* <CCol lg="1"></CCol> */}
                    </CRow>
                    <CRow className="home-items-plans">
                        <CCol sm="4">
                            <div style={styles.fadeInUp}>
                                <ItemsPlans img_path={img1} title={title1} body={'item1'}/>
                            </div>
                        </CCol>
                        <CCol sm="4">
                            <div style={styles.fadeInUp}>
                                <ItemsPlans img_path={img2} title={title2} body={'item2'}/>
                            </div>
                        </CCol>
                        <CCol sm="4">
                            <div style={styles.fadeInUp}>
                                <ItemsPlans img_path={img3} title={title3} body={'item3'}/>
                            </div>
                        </CCol>
                    </CRow>
                    <CRow className="justify-content-md-center item-buttons">
                        {/* <CCol lg="1"></CCol> */}
                        <CCol className="col-md-auto">
                            <CButton onClick={(e)=>{
                                 e.preventdefault()
                                history.push('/planes');
                            }} className="button1" type="submit" size="lg" color="secondary">Adquiere tu plan</CButton>
                        </CCol>
                        <CCol className="col-md-auto">
                            <CButton onClick={(e)=>{
                                e.preventdefault()
                                history.push('/mensajeria-corporativa');
                            }} className="button2" type="submit" size="lg" color="secondary">Mensajeria Corporativa</CButton>
                        </CCol>
                        {/* <CCol lg="1"></CCol> */}
                    </CRow>
                </CContainer>
            </StyleRoot>
        </>
    )
}

const ItemsPlans = (props) =>{
    let desc1 = (
    <>
        Nos integramos a cualquier <br/> tipo de negocio
    </>);
    let desc2 = (
    <>
        Sistema de logística <br/> automatizado y seguro
    </>);
    let desc3 = (
    <>
        Con tus clientes y <br/> brindamos la mejor atención
    </>);
    
    const descs = {
        item1: desc1,
        item2: desc2,
        item3: desc3
    }

    return (
        <>
            <CRow className="justify-content-md-center">
                <CCol className="col-md-auto">
                    <CImg 
                        src={props.img_path}
                        className="img-plans"
                    />
                    <br/>
                    <h3 className="title-plans">{props.title}</h3>
                    <h5 className="body-plans">{descs[props.body]}</h5>
                </CCol>
            </CRow>
        </>
    )
}

Plans.propTypes = {

}

export default Plans

