import React from 'react'
import PropTypes from 'prop-types'
import PublicFooter from '../global/PublicFooter';
import HeaderImage from './HeaderImage';
import PublicHeader from '../global/PublicHeader';
import PlanUpdate from './PlanUpdate';

import {
    useHistory,
} from "react-router-dom";


function PlanCambio(props) {
    const history = useHistory();
    return (
        <>
            {(!history.location.pathname.includes('planes-disponibles')) ? <PublicHeader /> : null}
            <HeaderImage />
            <PlanUpdate />
            <PublicFooter />
        </>
    )
}

PlanCambio.propTypes = {

}

export default PlanCambio

