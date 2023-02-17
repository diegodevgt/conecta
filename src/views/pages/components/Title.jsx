import { CCol, CRow } from '@coreui/react';

const Title = (props) => {

    return (
        <>
            <div className="container-titles">
                <CRow>
                    <CCol sm="12">
                        <div className="general-title">
                            <h2>{props.title}</h2>
                            <div className='general-element'></div>
                        </div>
                    </CCol>
                </CRow>
            </div>
        </>
    )

}

export default Title;