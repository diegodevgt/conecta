import React, {useState} from 'react'
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

function PlanUpdate(props) {
    return (
        <>
            <CContainer>
                <CRow className="planes-info mb-3"> 
                    <CCol className="planes-title">
                        Cambiar Plan
                    </CCol>
                </CRow>
                <CRow className="planes-update"> 
                    <CCol sm="6">
                    <CRow className="actual-plan"><CCol className="actual-plan-text"> PLAN ACTUAL</CCol> </CRow>
                        <CCard className="plan-inner-card">
                            <CCardBody className="pt-5 pb-5">
                                <CRow className="align-items-end" >
                                    <CCol sm="4">
                                        <CImg 
                                            // src={props.img}
                                            src='img/icons/planes/mundo.svg'
                                            className="diamond-button"
                                            style={{
                                                width: '100%',
                                                display:'block',
                                                marginLeft: 'auto',
                                                marginRight: 'auto'
                                            }}
                                        />
                                    </CCol>
                                    <CCol sm="8">
                                        <CRow>
                                            <CCol sm="12">
                                                <CRow className="left">
                                                    <CCol>
                                                        <span className="plan">
                                                            {/* {props.price} */}
                                                        Free
                                                        </span><br/>
                                                        <span className="plan">
                                                            {/* {props.price} */}
                                                            Q 0.00
                                                        </span><br/>
                                                        <span  className="month">
                                                        /mes
                                                        </span>
                                                    </CCol>
                                                </CRow>
                                            </CCol>
                                        </CRow>
                                    </CCol>
                                </CRow>
                            </CCardBody>
                        </CCard>
                    </CCol>
                    <CCol sm="6">
                    <CRow className="actual-plan"><CCol className="actual-plan-text"> PLAN NUEVO</CCol> </CRow>
                        <CCard className="plan-inner-card plan-inner-card-2">
                            <CCardBody className="pt-5 pb-5">
                                <CRow className="align-items-end">
                                    <CCol sm="4">
                                        <CImg 
                                            // src={props.img}
                                            src='img/icons/planes/estrella.svg'
                                            className="diamond-button"
                                            style={{
                                                width: '100%',
                                                display:'block',
                                                marginLeft: 'auto',
                                                marginRight: 'auto'
                                            }}
                                        />
                                    </CCol>
                                    <CCol sm="8">
                                        <CRow>
                                            <CCol sm="12">
                                                <CRow className="left">
                                                    <CCol>
                                                        <span className="plan">
                                                            {/* {props.price} */}
                                                        Pro
                                                        </span><br/>
                                                        <span className="plan">
                                                            {/* {props.price} */}
                                                            Q 149.00
                                                        </span><br/>
                                                        <span  className="month">
                                                        /mes
                                                        </span>
                                                    </CCol>
                                                </CRow>
                                            </CCol>
                                        </CRow>
                                    </CCol>
                                </CRow>
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
            </CContainer>
        </>
    )
}

PlanUpdate.propTypes = {

}

export default PlanUpdate

