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
                                display: 'block',
                                marginLeft: 'auto',
                                marginRight: 'auto'
                            }}
                            onClick={() => {
                                window.open('https://app.recurrente.com/s/conecta-guate/pack-ciudad', '_blank').focus();
                            }}
                        />
                    </CCol>
                    <CCol sm="4">
                        <CImg
                            className={"pack"}
                            src="img/packs/aledanos.png"
                            style={{
                                // width:'200px', 
                                display: 'block',
                                marginLeft: 'auto',
                                marginRight: 'auto'
                            }}
                            onClick={() => {
                                window.open('https://app.recurrente.com/s/conecta-guate/pack-aledanos', '_blank').focus();
                            }}
                        />
                    </CCol>
                    <CCol sm="4">
                        <CImg
                            className={"pack"}
                            src="img/packs/interior.png"
                            style={{
                                // width:'200px', 
                                display: 'block',
                                marginLeft: 'auto',
                                marginRight: 'auto'
                            }}
                            onClick={() => {
                                window.open('https://app.recurrente.com/s/conecta-guate/pack-interior', '_blank').focus();
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

