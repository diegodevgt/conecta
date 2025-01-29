
import PublicFooter from '../global/PublicFooter'
import PublicHeader from '../global/PublicHeader'
import Clients from './Clients'
import Plans from './Plans'
import Sales from './Sales'
import SliderTracking from './SliderTracking'
import Video from './Video'
import { BrowserRouter as Router, Route, Switch, useLocation } from 'react-router-dom'
import React, { useEffect } from 'react'


function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

const Home = () => {
  return (
    <>
      <ScrollToTop />
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
