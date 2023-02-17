import { CCol, CContainer, CImg, CRow } from "@coreui/react";


const LimitesUrbanos = (props) => {

    let limitesUrbanos = [
        "Calzada San Juan hasta colonia las Brisas Kilometro 18",
        "Boulevard Vista Hermosa hasta Trébol de Vista Hermosa.",
        "Calzada Roosevelt hasta entrada a San Cristobal Kilometro 18.5",
        "18 Calle zona 10 hasta Trébol de Vista Hermosa.",
        "Avenida Petapa hasta ciudad Real",
        "20 Calle zona 10 hasta 27 Avenida “A”.",
        "Avenida Hincapié hasta colonia Santa Fe.",
        "Carretera al Atlántico hasta entrada a Colonia San Rafael Kilometro 7.5"
    ];



    return (
        <>
            <CContainer className="limitesUrbanos-container">
                <CCol colSpan="12">
                    <h2 className="limitesUrbanos-titulo">
                        Limites Urbanos
                    </h2>
                    <br />
                    <CRow className="listadoLimitesUrbanos">
                        {limitesUrbanos.map(elemento => {
                            return (
                                <CCol lg="6" className="contenedorLimiteUrbano">
                                    <CImg
                                        src={"img/icons/mapa.png"}
                                        className="imgLimite"
                                        alt="Limite Urbano"></CImg>
                                    <p className="limiteUrbano">{elemento}</p>
                                </CCol>
                            )
                        })}
                    </CRow>
                </CCol>
            </CContainer>
        </>
    )
}

export default LimitesUrbanos;