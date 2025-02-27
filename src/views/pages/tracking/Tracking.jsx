
import PublicFooter from '../global/PublicFooter'
import PublicHeader from '../global/PublicHeader'
import HeaderTracking from './HeaderTracking'
import TrackingInformation from './TrackingInformation'

const Tracking = () => {
  return (
      <>
        <PublicHeader />
        <HeaderTracking></HeaderTracking>
        <TrackingInformation />
        <PublicFooter />
      </>
    
  )
}

export default Tracking
