import {
    CCol,
    CContainer, CFooter, CImg, CLink, CRow
} from '@coreui/react';

function PublicFooter(props) {
    const scrollContact = () => {
        window.scrollTo(0, 0);
    }

    return (
        <CFooter>
            <CContainer className="footer-container">
                <CRow>
                    <CCol lg="8">
                        <CRow>
                            <CCol lg="4">
                                <LinkFooter name="FAQs" type="link" link="/faqs" />
                                <LinkFooter name="Termino y condiciones" type="link" external={true} link="https://conectaguate.com/legales/terminso_condiciones_conecta22.pdf" />
                                <LinkFooter name="Nosotros" type="link" link="/nosotros" />
                            </CCol>
                            <CCol lg="4">
                                <LinkFooter name="Bolsa de empleo" type="link" link="/bolsa-de-empleo" />
                                <LinkFooter name="Comercios" type="link" link="/#clientesSatisfechos" />
                                <LinkFooter name="Contacto" type="link" link="/contacto" onClick={scrollContact()} />
                            </CCol>
                            <CCol lg="4">
                                <LinkFooter name="15 ave 'A' 21-13 Zona 13" type="link" external={true} link="https://www.google.com/maps/place/Conecta/@14.6104537,-90.5005334,15z/data=!4m5!3m4!1s0x0:0x4c595030980a1a89!8m2!3d14.6104537!4d-90.5005334" />
                                <LinkFooter name="(502) 2306-9030" type="link" external={true} link="tel:+502-2306-9030" />
                                <LinkFooter name="info@conectaguate.com" type="link" external={true} link="mailto:info@conectaguate.com" />
                            </CCol>
                        </CRow>
                    </CCol>
                    <CCol lg="4">
                        <CContainer>
                            <CRow className="justify-content-evenly">
                                <CCol lg="4" md="4" sm="4" xs="4" className="col-social-icons">
                                    <CImg
                                        className="social-icons w-100"
                                        src="/img/icons/facebook.svg"
                                        onClick={() => {
                                            window.open('https://www.facebook.com/ConectaGuateOficial/', '_blank').focus();
                                        }}
                                    />
                                </CCol>
                                <CCol lg="4" md="4" sm="4" xs="4" className="col-social-icons">
                                    <CImg
                                        className="social-icons w-100"
                                        src="/img/icons/instagram.svg"
                                        onClick={() => {
                                            window.open('https://www.instagram.com/conectagt_/', '_blank').focus();
                                        }}
                                    />
                                </CCol>
                                <CCol lg="4" md="4" sm="4" xs="4" className="col-social-icons">
                                    <CImg
                                        className="social-icons w-100"
                                        src="/img/icons/whatsapp.svg"
                                        onClick={() => {
                                            window.open('https://api.whatsapp.com/send/?phone=50242860214&text=%C2%A1Quiero%20conectarme!%20%C2%BFMe%20podr%C3%ADan%20dar%20mas%20informaci%C3%B3n?', '_blank').focus();
                                        }}
                                    />

                                </CCol>
                            </CRow>
                        </CContainer>
                    </CCol>
                </CRow>
            </CContainer>
        </CFooter>
    )
}

const LinkFooter = (props) => {
    const new_tab = (props.external) ? true : false;
    const disabled = (props.disabled) ? true : false;


    const render_link = (type) => {
        let render;
        if (type === 'link') {
            if (props.external) {
                render = (<CLink
                    className="link-item"
                    href={`${props.link}`}
                    target={(new_tab) ? "_blank" : ""}
                    disabled={(disabled) ? true : false}
                >
                    {props.name}
                </CLink>);
            } else {
                render = (<CLink
                    className="link-item"
                    to={`${props.link}`}
                    disabled={(disabled) ? true : false}
                >
                    {props.name}
                </CLink>);
            }
        } else if (type === 'tel') {
            render = (<CLink
                className="link-item"
                onClick={() => {
                    window.open(`tel:23069030`);
                }}
            >
                {props.name}
            </CLink>);
        } else if (type === 'mail') {
            render = (<CLink
                className="link-item"
                onClick={() => {
                    window.open(`mailto:${props.name}`);
                }}
            >
                {props.name}
            </CLink>);
        }

        return render;
    }


    return (
        <CRow>
            {render_link(props.type)}
        </CRow>
    )
}

export default PublicFooter

