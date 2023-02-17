import React, { useState } from 'react'
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
} from '@coreui/react'
import { DocsLink } from 'src/reusable'
import CIcon from '@coreui/icons-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlayCircle } from '@fortawesome/free-solid-svg-icons'

function Video(props) {
    const [show_video, setShowVideo] = useState(false);
    return (
        <>
            <CRow className="home-video">
                <CCol lg="12" className="home-video-single-column">
                    <CJumbotron fluid className="home-video-jumbotron" onClick={() => {
                        setShowVideo(true)
                    }}>
                        <CContainer fluid className={(!show_video) ? "background-image-video" : "video-youtube"}>
                            <CRow className="align-items-center">
                                {(!show_video) ?
                                    <CCol className="home-vide-content">
                                        <h2 className="title">
                                            ¿Cómo me registro?
                                        </h2>
                                        <h3 className="body">
                                            Conectar tu negocio es muy fácil, ve el siguiente tutorial.
                                        </h3>
                                        <CImg
                                            className="play-icon"
                                            src={`img/icons/play.png`}
                                        />
                                    </CCol> :
                                    <CCol>
                                        <CEmbed
                                            ratio="16by9"
                                        >
                                            <iframe src="https://www.youtube.com/embed/yOoCLHX4K8w?autoplay=1&cc_load_policy=0" allow="autoplay; encrypted-media" title="YouTube video player" frameborder="0" allowfullscreen></iframe>
                                        </CEmbed>
                                    </CCol>
                                }
                            </CRow>
                        </CContainer>
                    </CJumbotron>
                </CCol>
            </CRow>
        </>
    )
}


export default Video

