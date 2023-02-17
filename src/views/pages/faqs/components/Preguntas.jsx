import { CCol, CContainer, CImg, CRow } from "@coreui/react";

const Preguntas = (props) => {
    if (props.step === "1") {
        return (
            <>
                <CContainer className="Preguntas-container">
                    <CRow className="Preguntas-row">
                        <CCol xs="8">
                            <h1 className="Preguntas-titulo">
                                ¿Cómo hacer un pedido por la página web?
                            </h1>
                            <br />
                            <p>
                                Existen dos formas para que puedas realizar tu pedido a través de nuestro sitio web.
                            </p>
                            <CRow>
                                <CCol lg="6">
                                    <h5>Con usuario:</h5>
                                    <ul>
                                        <li>
                                            Ingresa a conectaguate.com y haz click en “Account” para iniciar sesión.
                                        </li>
                                    </ul>
                                </CCol>
                                <CCol lg="6">
                                    <h5>Sin usuario:</h5>
                                    <p>
                                        Ingresa a conectaguate.com y llena el formulario “Quiero conectarme” y haz click en “conectar”, uno de nuestros ejecutivos se pondrá en contacto a la brevedad para tomar los datos de tu envío.
                                    </p>
                                </CCol>
                            </CRow>
                        </CCol>
                        <CCol xs="4" className="colContainerImgPregunta">
                            <CImg
                                src={"img/icons/preguntas/pregunta1.jpeg"}
                                className="imagenPregunta"
                                alt="Imagen Pregunta"></CImg>
                        </CCol>
                    </CRow>
                    <CRow className="Preguntas-row">
                        <CCol xs="4" className="colContainerImgPregunta">
                            <CImg
                                src={"img/icons/preguntas/pregunta2.jpeg"}
                                className="imagenPregunta"
                                alt="Imagen Pregunta 2"></CImg>
                        </CCol>
                        <CCol xs="8">
                            <h1 className="Preguntas-titulo">
                                ¿Qué sucede si la dirección de entrega es incorrecta?
                            </h1>
                            <br />
                            <p>
                                Si proporcionaste el número de teléfono del destinatario podremos contactarle para determinar el lugar de entrega, de lo contrario existen dos opciones:
                            </p>
                            <CRow>
                                <CCol lg="6">
                                    <h5>Sin suscripción:</h5>
                                    <ul>
                                        <li>
                                            Se te hará el cobro del primer envío y de la devolución al momento de entregarte el paquete según la tarifa establecida.
                                        </li>
                                    </ul>
                                </CCol>
                                <CCol lg="6">
                                    <h5>Con suscripción:</h5>
                                    <p>
                                        Se tomará como devolución y se te restará de tus devoluciones gratuitas en caso aún tengas disponibles, el cobro del envío se realizará sobre la tarifa plana de suscriptores; si la devolución fue en la ciudad y aún cuentas con envíos gratuitos no se te realizará cobro pero se te descontará un envío.
                                    </p>
                                </CCol>
                            </CRow>
                        </CCol>
                    </CRow>
                </CContainer>
            </>
        );
    } else {
        return (
            <>
                <CContainer className="Preguntas-container">
                    <CRow className="Preguntas-row">
                        <CCol xs="4" className="colContainerImgPregunta">
                            <CImg
                                src={"img/icons/preguntas/pregunta3.jpeg"}
                                className="imagenPregunta"
                                alt="Imagen Pregunta"></CImg>
                        </CCol>
                        <CCol xs="8">
                            <h1 className="Preguntas-titulo">
                                ¿En cuántos días entregan mi paquete?
                            </h1>
                            <br />
                            <CRow>
                                <CCol lg="6">
                                    <h5>Ciudad:</h5>
                                    <ul>
                                        <li>
                                            los envíos recolectados durante la mañana serán entregados en el transcurso de la tarde, los envíos recolectados en el transcurso de la tarde serán entregados al día siguiente por la mañana.
                                        </li>
                                    </ul>
                                </CCol>
                                <CCol lg="6">
                                    <h5>Interior:</h5>
                                    <ul>
                                        <li>
                                            los envíos a cualquier departamento se realizan dentro de las próximas 24 a 72 horas después de haber recolectado el paquete según la cobertura.
                                        </li>
                                    </ul>
                                </CCol>
                            </CRow>
                        </CCol>

                    </CRow>
                </CContainer>
            </>
        );
    }

}

export default Preguntas;
