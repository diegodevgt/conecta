import { CCol, CImg, CContainer, CRow } from "@coreui/react";

const SeguimientoEnvio = (props) => {

    return (
        <>
            <CContainer className="coberturas-recomendaciones">
                <CRow className="rowProductosFragiles">
                    <CCol xs="1">
                    </CCol>
                    <CCol xs="10">
                        <CRow>
                            <CCol xs="8" className="columnaFragil">
                                <h2 className="tituloFragil">¿Cómo darle seguimiento a mi envío?</h2>
                                <br />
                                <p className="textoFragil">
                                    Puedes conocer el status de tu envío en tiempo real a través de la página conectaguate.com, solamente coloca el número de tracking proporcionado en el buscador de “¿Dónde está mi paquete?”.
                                </p>
                            </CCol>
                            <CCol xs="4">
                                <CImg
                                    src={"img/icons/SeguimientoPedido/seguimientopedido.jpeg"}
                                    className="imgEmpaque"
                                    alt="Empaque"></CImg>
                            </CCol>
                        </CRow>
                    </CCol>
                    <CCol xs="1">
                    </CCol>
                </CRow>
            </CContainer>
        </>
    )

}

export default SeguimientoEnvio;