import React from 'react'
import PropTypes from 'prop-types'
import PublicFooter from '../global/PublicFooter';
import HeaderImage from './HeaderImage';
import PublicHeader from '../global/PublicHeader';
import PlanesInfo from './PlanesInfo';
import Packs from './Packs';
import {
    useHistory,
} from "react-router-dom";


function Planes(props) {
    const history = useHistory();

    return (
        <>
            {(!history.location.pathname.includes('planes-disponibles')) ? <PublicHeader /> : null}
            <HeaderImage />
            <PlanesInfo />
            <Packs />
            <PublicFooter />
        </>
    )
}

Planes.propTypes = {

}

export default Planes

