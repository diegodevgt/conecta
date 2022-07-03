import React, {Fragment} from 'react'

import PublicHeader from '../global/PublicHeader'
import SliderTracking from './SliderTracking'
import Plans from './Plans'
import Sales from './Sales'
import Video from './Video'
import Clients from './Clients'
import PublicFooter from '../global/PublicFooter'

const Home = () => {
  return (
      <>
        <PublicHeader />
        <SliderTracking />
        <Plans />
        <Sales />
        <Video />
        <Clients />
        <PublicFooter />
      </>
    
  )
}

export default Home
