import React, {Fragment, useState, useEffect} from 'react'
import { useHistory } from "react-router-dom";
import PropTypes from 'prop-types'
import {
    CButton,
    CCard,
    CCardBody,
    CCardGroup,
    CCol,
    CContainer,
    CInput,
    CInputGroup,
    CInputGroupPrepend,
    CInputGroupText,
    CRow,
    CCollapse,
    CCardHeader,
    CDropdownItem,
    CDropdownMenu,
    CDropdownToggle,
    CNavbar,
    CNavbarNav,
    CNavbarBrand,
    CNavbarText,
    CToggler,
    CNavLink,
    CDropdown,
    CForm,
    CImg,
    CNavItem,
    CDropdownDivider,
  } from '@coreui/react'
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
  import { faUserCircle } from '@fortawesome/free-solid-svg-icons'
  import CIcon from '@coreui/icons-react'

function PublicHeader(props) {
    const [isOpen, setIsOpen] = useState(false);
    const history = useHistory();

    return (
      <div>
        <CNavbar expandable="sm" className="home-header" >
          <CToggler
            style={{
              backgroundColor: '#153b75'
            }}
            inNavbar onClick={() => setIsOpen(!isOpen)}/>
          <CNavbarBrand onClick={(e)=>{
            e.preventdefault()
            history.push('/');
          }}>
              <CImg 
                src={"img/logo_conecta.png"}
                fluid
                className="home-header-logo"
              />
          </CNavbarBrand>
          <CCollapse show={isOpen} navbar>
            <CNavbarNav>
             
            </CNavbarNav>
            <CNavbarNav className="ml-auto home-header-options" >
                <CNavLink className="home-header-options-item" to={"/"}>Inicio</CNavLink>
                <CNavLink className="home-header-options-item" to={"/comercio"}>Comercio</CNavLink>
                <CNavLink className="home-header-options-item" to={"/planes"}>Planes</CNavLink>
                <CNavLink className="home-header-options-cta" to={"/login"}>Hacer un envío</CNavLink>
                <CNavLink className="home-header-options-account"  to={"/register"}>
                    <FontAwesomeIcon 
                    icon={faUserCircle}  
                    style={{marginRight:'.3rem'}} 
                    size="lg"
                    />
                    Cuenta
                </CNavLink>
            </CNavbarNav>
          </CCollapse>
        </CNavbar>
      </div>
    )

}


export default PublicHeader

