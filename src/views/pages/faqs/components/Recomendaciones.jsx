import { CCol, CImg, CContainer, CRow } from "@coreui/react";

const Recomendaciones = (props) => {


    let recomendaciones = [
        "Para evitar inconvenientes y poderte brindar el mejor servicio necesitamos que todos tus paquetes estén perfectamente empacados, sobres y cajas cerrados con una rotulación legible que incluya todos los datos del remitente y destinatario. Debes indicar si es un producto frágil o si requiere de una posición específica para ser transportado.",
        "Cajas de cartón corrugado libres de huecos o abolladuras.",
        "En caso de productos frágiles o de menor tamaño en comparación con su empaque, se recomienda colocar protección interna.",
        "Etiqueta: recomendamos que el paquete lleve una etiqueta con los datos del destinatario colocado en un lugar visible del paquete.",
        "Envíos múltiples: Enumerar las cajas junto con el número de orden de envío proporcionado al momento de realizar la solicitud (Ej: 1/3, 2/3, 3/3)."
    ];


    return (
        <>
            <CContainer className="coberturas-recomendaciones">
                <CRow className="rowRecomendaciones">
                    <CCol lg="6">
                        <h2 className="titulo_recomendaciones">Recomendaciones de empaque</h2>
                        <br />
                        <div className="container_recomendaciones_texts">
                            {recomendaciones.map((recomendacion, index) => {
                                return (
                                    <CCol lg="12">
                                        <h6><strong>Recomendación {index + 1}:</strong></h6>
                                        <p className="texto_recomendacion">
                                            {recomendacion}
                                        </p>
                                    </CCol>
                                )
                            })}
                            <CCol lg="12">
                                <p className="texto_recomendacion"><strong>Envíos múltiples:</strong><br />Enumerar las cajas junto con el número de orden de envío proporcionado al momento de realizar la solicitud (Ej: 1/3, 2/3, 3/3).</p>
                            </CCol>
                        </div>
                    </CCol>
                    <CCol lg="6">
                        <CImg
                            src={"img/icons/empaque.jpeg"}
                            className="imgEmpaque"
                            alt="Empaque"></CImg>
                    </CCol>
                </CRow>
                <CRow className="rowProductosFragiles">
                    <CCol lg="12">
                        <CRow>
                            <CCol lg="4">
                                <CImg
                                    src={"img/icons/fragil2.png"}
                                    className="imgEmpaque"
                                    alt="Empaque"></CImg>
                            </CCol>
                            <CCol lg="8" className="columnaFragil">
                                <h2 className="tituloFragil">¿Envían productos frágiles?</h2>
                                <br />
                                <p className="textoFragil">
                                    Sí, siempre y cuando el producto esté correctamente protegido y empacado para evitar inconvenientes. Puedes preguntarle al ejecutivo que te atiende sobre las recomendaciones de empaque para tu tipo de producto.
                                </p>
                            </CCol>
                        </CRow>
                    </CCol>
                </CRow>
            </CContainer>
        </>
    );

}

export default Recomendaciones;