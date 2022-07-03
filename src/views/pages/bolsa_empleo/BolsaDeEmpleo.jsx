import React from 'react'
import PublicFooter from '../global/PublicFooter';
import PublicHeader from '../global/PublicHeader';
import HeaderImage from './HeaderImage';
import InfoForm from './InfoForm';


function BolsaDeEmpleo(props) {
    return (
        <>
            <PublicHeader />
            <HeaderImage />
            <InfoForm />
            <PublicFooter />  
        </>
    )
}

BolsaDeEmpleo.propTypes = {

}

export default BolsaDeEmpleo

