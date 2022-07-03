import React from 'react'
import PropTypes from 'prop-types'
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

function Packs(props) {
    return (
        <>  
            <CContainer className="packs-container">
                <CRow style={{
                }}>
                    <CCol sm="4">
                        <CImg 
                            className={"pack"}
                            src={"img/packs/ciudad.png"}
                            style={{
                                // width:'200px', 
                                display:'block',
                                marginLeft: 'auto',
                                marginRight: 'auto'
                            }}
                        />
                    </CCol>
                    <CCol sm="4">
                        <CImg 
                            className={"pack"}
                            src="img/packs/aledaños.png"
                            style={{
                                // width:'200px', 
                                display:'block',
                                marginLeft: 'auto',
                                marginRight: 'auto'
                            }}
                        />
                    </CCol>
                    <CCol sm="4"> 
                        <CImg 
                            className={"pack"}
                            src="img/packs/interior.png"
                            style={{
                                // width:'200px', 
                                display:'block',
                                marginLeft: 'auto',
                                marginRight: 'auto'
                            }}
                        />
                    </CCol>
                </CRow>  
            </CContainer>
        </>
    )
}

Packs.propTypes = {

}

export default Packs

