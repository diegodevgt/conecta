import {
  CCollapse, CImg, CNavbar, CNavbarBrand, CNavbarNav, CNavLink, CToggler
} from '@coreui/react';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { useHistory } from "react-router-dom";

function PublicHeader(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrollAuto, setScrollAuto] = useState('');
  const history = useHistory();

  window.onscroll = function () { myFunction() };

  function myFunction() {
    if (window.scrollY > 200) {
      setScrollAuto('container-header active');
    } else {
      setScrollAuto('container-header');
    }
  }

  return (
    <div className={`${scrollAuto}`}>
      <CNavbar expandable="sm" className="home-header" >
        <CToggler
          style={{
            backgroundColor: '#153b75'
          }}
          inNavbar onClick={() => setIsOpen(!isOpen)} />
        <CNavbarBrand onClick={(e) => {
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
            <CNavLink className="home-header-options-item" to={"/#clientesSatisfechos"}>Comercio</CNavLink>
            <CNavLink className="home-header-options-item" to={"/planes"}>Planes</CNavLink>
            <CNavLink className="home-header-options-cta" to={"/login"}>Hacer un envío</CNavLink>
            <CNavLink className="home-header-options-account" to={"/register"}>
              <FontAwesomeIcon
                icon={faUserCircle}
                style={{ marginRight: '.3rem' }}
                size="lg"
              />
              Cuenta
            </CNavLink>
          </CNavbarNav>
        </CCollapse>
      </CNavbar>
    </div >
  )

}


export default PublicHeader

