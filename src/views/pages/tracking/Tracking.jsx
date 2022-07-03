import React, {Fragment} from 'react'

import PublicHeader from '../global/PublicHeader'
import HeaderTracking from './HeaderTracking'
import PublicFooter from '../global/PublicFooter'
import TrackingInformation from './TrackingInformation'


const Tracking = () => {
  return (
      <>
        <PublicHeader />
        <HeaderTracking />
        <TrackingInformation />
        <PublicFooter />
      </>
    
  )
}

export default Tracking
