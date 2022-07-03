import React from 'react'
import {
    CCard,
    CCol,
    CContainer,
    CJumbotron,
    CRow,
  } from '@coreui/react';

function HeaderImage(props) {
    return (
        <>
            <CRow className="bolsa-header">
                <CCol lg="12"  className="col-slider">
                    <CCard className="bolsa-header-card">
                        {/* <CCardBody> */}
                        <CJumbotron 
                        className="border bolsa-header-background" 
                        >   
                            <CContainer className="bolsa-header-container">
                                <CRow className="align-items-end row-tracking">
                                    <CCol lg="4" className="align-self-end">
                                       
                                    </CCol>
                                </CRow>
                            </CContainer>
                        </CJumbotron>
                    </CCard>
                </CCol>
            </CRow>
        </>
    )
}

export default HeaderImage

