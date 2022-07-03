import React, {useState} from 'react'
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
        <CRow className="cross-selling-video">
            <CCol lg="12" className="cross-selling-single-column">
                <CJumbotron fluid className="cross-selling-jumbotron" onClick={()=>{
                    setShowVideo(true)
                }}>
                    <CContainer fluid className={(!show_video) ? "background-image-video" : "video-youtube"}>
                        <CRow className="align-items-center" style={{height:'100%'}}>
                            {(!show_video) ?
                                <CCol className="cross-selling-content">
                                    <CRow className="align-items-center">
                                        <CCol>
                                            <CImg
                                                className="play-icon"
                                                src={`img/icons/play.png`}
                                            />
                                        </CCol>
                                    </CRow>                                    
                                </CCol> :
                                <CCol>
                                    <CEmbed
                                        ratio="16by9"
                                    >
                                        <iframe src="https://www.youtube.com/embed/fZYH9ZraTvY?autoplay=1&cc_load_policy=0" allow="autoplay; encrypted-media"  title="YouTube video player" frameborder="0" allowfullscreen></iframe> 
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

