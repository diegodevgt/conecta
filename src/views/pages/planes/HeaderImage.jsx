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
    CEmbed,
    CEmbedItem,
    CInput,
    CInputGroup,
    CInputGroupText,
    CInputGroupPrepend,
    CInputGroupAppend,
    CFormGroup,
    CLabel,
    CTextarea,
    CImg
  } from '@coreui/react';

function HeaderImage(props) {
    return (
        <>
            <CRow className="planes-header">
                <CCol lg="12"  className="col-slider">
                    <CCard className="planes-header-card">
                        {/* <CCardBody> */}
                        <CJumbotron 
                        className="planes-header-background" 
                        >   
                            <CContainer className="planes-header-container">
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

