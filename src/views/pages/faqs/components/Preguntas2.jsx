import { CCol, CContainer, CImg, CRow } from "@coreui/react";

const Preguntas2 = (props) => {
    if (props.step === "1") {
        return (
            <>
                <CContainer className="Preguntas2">
                    <CRow className="Preguntas-row">
                        <CCol xs="8" className="columna-img">
                            <CImg
                                src={"img/icons/preguntas2/fondo1.jpeg"}
                                className="imagenFondo"
                                alt="Imagen Pregunta"></CImg>
                        </CCol>
                        <CCol xs="4">
                            <CRow className="rowCardPregunta">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="card-title">
                                            ¿En cuánto tiempo depositan el dinero al utilizar el servicio PCE?
                                        </h5>
                                        <div className="separador"></div>
                                        <p class="card-text">Si utilizas el servicio PCE el depósito de lo cobrado se realizará por transferencia semanalmente según el plan en el que te encuentres después de que el paquete haya sido entregado o destino del paquete.</p>
                                    </div>
                                </div>
                            </CRow>
                        </CCol>
                    </CRow>
                </CContainer>
            </>
        )
    } else {
        return (
            <>
                <CContainer className="Preguntas2">
                    <CRow className="Preguntas-row">

                        <CCol xs="4">
                            <CRow className="rowCardPregunta right">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="card-title">
                                            ¿Qué beneficios me trae la suscripción?
                                        </h5>
                                        <div className="separador left"></div>
                                        <p class="card-text">Tarifas planas para el departamento de Guatemala y el interior, atención personalizada para ti y tu cliente, etiquetado de producto, depositos semanales.</p>
                                    </div>
                                </div>
                            </CRow>
                        </CCol>
                        <CCol xs="8" className="columna-img">
                            <CImg
                                src={"img/icons/preguntas2/fondo2.jpeg"}
                                className="imagenFondo"
                                alt="Imagen Pregunta"></CImg>
                        </CCol>
                    </CRow>
                </CContainer>
            </>
        )
    }
}

export default Preguntas2;