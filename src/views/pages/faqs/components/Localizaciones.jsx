import { CCol, CContainer, CImg, CRow } from "@coreui/react";

const Localizaciones = (props) => {
    return (
        <>
            <CContainer className="LocalizacionesInfo">
                <CRow className="Localizaciones-row">
                    <CCol xs="6">
                        <div className="cuadro-texto">
                            <h5>
                                ¿Cómo puedo contactarlos?
                            </h5>
                            <p>
                                Puedes escribirnos a través de:
                            </p>
                        </div>
                    </CCol>
                    <CCol xs="6">
                        <CRow className="contactanos-textos">
                            <div className="apartado">
                                <p className="apartadoTitulo">
                                    Geta través de
                                </p>
                                <span className="separador"></span>
                            </div>
                            <div className="apartadoInformacion">
                                <div className="elemento">
                                    <CImg
                                        src={"img/icons/localizaciones/mail.png"}
                                        className="iconoElemento"
                                        alt="icono Mail"></CImg>
                                    <p>info@conectaguate.com</p>
                                </div>
                                <div className="elemento">
                                    <CImg
                                        src={"img/icons/localizaciones/telefono.png"}
                                        className="iconoElemento"
                                        alt="icono Telefono"></CImg>
                                    <p>+502 4479-3488</p>
                                </div>
                            </div>
                            <div className="apartado">
                                <p className="apartadoTitulo">
                                    Oficinas centrales
                                </p>
                                <span className="separador"></span>
                            </div>
                            <div className="apartadoInformacion">
                                <div class="mapouter"><div class="gmap_canvas"><iframe class="gmap_iframe" width="100%" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?width=600&amp;height=400&amp;hl=en&amp;q=worx&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"></iframe><a href="https://formatjson.org/">format json</a></div></div>
                            </div>
                        </CRow>
                    </CCol>
                </CRow>
            </CContainer>
        </>
    )
}

export default Localizaciones;