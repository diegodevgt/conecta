import {
    CButton, CCol, CImg, CRow
} from '@coreui/react';
import Radium from 'radium';
import { bounceInLeft, fadeInUp, bounceInRight } from 'react-animations';

function Sales(props) {
    const styles = {
        bounceInLeft: {
            animation: 'x 1s',
            animationName: Radium.keyframes(bounceInLeft, 'bounceInLeft')
        },
        bounceInRight: {
            animation: 'x 1s',
            animationName: Radium.keyframes(bounceInRight, 'bounceInRight')
        },
        fadeInUp: {
            animation: 'x 1s',
            animationName: Radium.keyframes(fadeInUp, 'fadeInUp')
        }
    }
    return (
        <>
            <CRow className="home-sales">
                <CCol lg="6">
                    <CRow
                        className="align-items-center"
                        style={{
                            width: '100%',
                            height: '90%',
                            marginRight: '0',
                            marginLeft: '0'
                        }}>
                        <CCol>
                        </CCol>
                        <CCol lg="9">
                            <CRow>
                                <CCol style={styles.bounceInLeft}>
                                    
                                        <h3 className="title">
                                            Aumenta <br /> tus ventas
                                        </h3>
                                    
                                </CCol>
                            </CRow>
                            <CRow>
                                <CCol className="body" style={styles.bounceInRight}>
                                        Con envios a toda Guate aumentarás tus
                                        ventas. Además con nuestro marketplace
                                        automatizado llegarás a más personas.
                                </CCol>
                            </CRow>
                            <CRow>
                                <CCol className="cta">
                                    <CButton className="button" onClick={() => {
                                        window.open('https://www.conectaguate.com/#/planes', '_blank');
                                    }} type="submit" size="lg" color="secondary">Ver más</CButton>
                                </CCol>
                            </CRow>
                        </CCol>
                        <CCol>
                        </CCol>
                    </CRow>
                </CCol>
                <CCol lg="6" className="sales-image-hero" style={styles.fadeInUp}>
                        <CImg
                            src={"img/hero/office-background-blue.png"}
                            className="d-inline-block img-fluid"
                            alt="ventas conecta"
                        />
                </CCol>
            </CRow>
        </>
    )
}


export default Sales

