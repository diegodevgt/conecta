
import PublicFooter from '../global/PublicFooter'
import PublicHeader from '../global/PublicHeader'
import Clients from './Clients'
import Plans from './Plans'
import Sales from './Sales'
import SliderTracking from './SliderTracking'
import Video from './Video'

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
