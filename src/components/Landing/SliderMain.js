import React, { useCallback, useEffect, useState } from 'react';
import { Link } from '@reach/router';
import { createGlobalStyle } from 'styled-components';
import Reveal, { Zoom } from 'react-awesome-reveal';
import { useSelector } from 'react-redux';
import ModalVideo from 'react-modal-video'
import { fadeInUp } from '../utils';
// import Particles from '../components/Particles';
import { FlipDate } from './FlipDate';
import * as selectors from '../../store/selectors';
import { getStartPresaleTime, getEndPresaleTime } from '../../core/web3';
import { getUTCNow, getUTCDateTime } from '../utils';

import '../../../node_modules/react-modal-video/scss/modal-video.scss';

const GlobalStyles = createGlobalStyle`
  .header-logo {
    position: absolute;
    top: 10px;
    left: 0;
    @media only screen and (max-width: 768px) {
      left: 20px;
      img {
        width: 60px;
      }
    }
  }
  .header-app {
    position: absolute;
    top: 40px;
    right: 0;
    @media only screen and (max-width: 768px) {
      right: 20px;
      a {
        padding: 0.6rem 1.3rem !important;
        font-size: 0.9rem !important;
      }
    }
  }
  .btn-purchase {
    @media only screen and (max-width: 768px) {
      right: 20px;
      padding: 0.6rem 1.3rem !important;
      font-size: 0.9rem !important;
    }
  }
  .banner-container {
    z-index: 9;
    position: relative;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .banner-full-container {
    width: 100%;
    height: 100%;
    @media only screen and (min-width: 993px) {
      &:after {
        content: '';
        background: url(/img/banner-shape.png) center right no-repeat;
        height: 436px;
        width: 899px;
        position: absolute;
        right: 0;
        top: 30%;
        @media only screen and (max-width: 1400px) {
          background-size: 70%;
        }
        @media only screen and (max-width: 1200px) {
          background-size: 60%;
        }
      }
    }
  }
  .banner-content {
    z-index: 99;
    h1 {
      font-family: 'Poppins';
    }
    h3 {
      line-height: 1;
    }
    @media only screen and (max-width: 992px) {
      padding-top: 15px;
      text-align: center;
      h1 {
        font-size: 3rem;
      }
    }
    @media only screen and (max-width: 768px) {
      h1 {
        font-size: 2rem;
      }
      h3 {
        font-size: 1.3rem;
        line-height: 1.5rem;
      }
    }
    @media only screen and (max-width: 576px) {
      h1, h3 {
        font-size: 1.2rem;
        line-height: 1.5rem;
        padding-top: 10px;
      }
    }
  }
  .banner-logo {
    position: absolute;
    bottom: 10px;
    right: 0;
    width: 550px;
    @media only screen and (max-width: 992px) {
      position: relative;
      width: 400px;
    }
  }
  .banner-title {
    @media only screen and (max-width: 1200px) {
      
    }
    @media only screen and (max-width: 992px) {
      width: 250px;
      margin: auto;
    }
  }
  .banner-subtitle {
    font-family: "Poppins";
    margin-top: 20px;
    margin-bottom: 40px;
    font-size: 30px;
    @media only screen and (max-width: 992px) {
      margin-bottom: 30px;
      text-align: center;
    }
    @media only screen and (max-width: 576px) {
      display: none;
    }
  }
  .home-header-btns {
    display: flex;
    justify-content: start;
    gap: 30px;
    @media only screen and (max-width: 1024px) {
      flex-direction: column;
      align-items: center;
    }
  }
  .logo-anim {
    width: 550px;
    position: absolute;
    right: 0;
  }
  .banner-bottom {
    display: flex;
    gap: 20px;
    @media only screen and (max-width: 992px) {
      justify-content: center;
    }
  }
  .move-first {
    @media only screen and (max-width: 992px) {
      order: -1;
    }
  }
  @keyframes button-ripple {
    70% { 
      box-shadow:0 0 0 15px #fe7a20;
      opacity:0;
    }
    100% {
      box-shadow:0 0 0 0 #fe7a20;
      opacity:0;
    }
  }
  .video-content {
    display: flex;
    position: relative;
    width: 45px;
    height: 45px;
    line-height: 31px;
    color: #ffffff;
    background-color: transparent;
    background-image: linear-gradient(234deg,#fdb806 0%,#d77416 40%,#ff4137 100%);
    border-radius: 50%;
    justify-content: center;
    align-items: center;
    &:hover {
      color: white;
    }
  }
  .video-content:before, .video-content:after, .video-content>i:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    opacity: .6;
    z-index: -1;
    animation: button-ripple 3s infinite;
  }
  .video-content:before {
    animation-delay: .9s;
  }
  .video-content:after {
    animation-delay: .3s;
  }
  .btn-overview {
    display: flex;
    align-items: center;
    justify-content: center;
    gap:5px;
  }
`;

const Slidermain = () => {
  const web3 = useSelector(selectors.web3State);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [deadLine, setDeadLine] = useState(0);
  const [isOpen, setOpen] = useState(false)

  const initialize = useCallback(async () => {
    if (!web3) {
      return;
    }
    let start_time = 0;
    let result = await getStartPresaleTime();
    if (result.success) {
      start_time = Number(result.start_time) * 1000;
      setStartTime(start_time);
      if (start_time > getUTCNow()) {
        setDeadLine(start_time);
      }
    } else {
      return;
    }
    result = await getEndPresaleTime();
    if (result.success) {
      const time = Number(result.end_time) * 1000;
      setEndTime(Number(time));
      if (time > getUTCNow() && start_time < getUTCNow()) {
        setDeadLine(time);
      }
    }
  }, [web3]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <div className='full-container banner-full-container'>
      <div className="container banner-container">
        <GlobalStyles />
        {/* <Particles /> */}
        <Reveal keyframes={fadeInUp} className='header-logo onStep' delay={0} duration={800} triggerOnce>
          <Link to="/" className=''>
            <img
              src="/img/logo-main.png"
              className="img-fluid d-block"
              width="80px"
              alt="#"
            />
          </Link>
        </Reveal>
        <Reveal keyframes={fadeInUp} className='onStep header-app' delay={0} duration={800} triggerOnce>
          <Link to="/magic_ico" className='btn-orange'>
            Enter Presale
          </Link>
        </Reveal>
        <div className='row full-width'>
          <div className='col-lg-8 col-md-12'>
            <div className='banner-content'>
              <Reveal keyframes={fadeInUp} className='onStep' delay={0} duration={1000} triggerOnce>
                <img
                  src="/img/logo-title.png"
                  className="img-fluid d-block banner-title"
                  width="450px"
                  alt="#"
                />
              </Reveal>
              <Reveal keyframes={fadeInUp} className='onStep' delay={300} duration={1000} triggerOnce>
                <h3 className='banner-subtitle'>DeFi Autostaking Protocol Powering a True Business Launchpad</h3>
              </Reveal>
              {deadLine > 0 && (
                <Reveal keyframes={fadeInUp} className='onStep' delay={600} duration={1000} triggerOnce>
                  <>
                    {startTime > 0 && startTime > getUTCNow() && (
                      <p className='fs-24 fs-sm-20 f-semi-b uppercase'>Presale will be started soon!</p>
                    )}
                    {startTime > 0 && endTime > 0 && startTime < getUTCNow() && endTime > getUTCNow() && (
                      <p className='fs-24 fs-sm-20 f-semi-b uppercase'>Presale has started!</p>
                    )}
                    {endTime > 0 && endTime < getUTCNow() && (
                      <p className='fs-24 fs-sm-20 f-semi-b uppercase'>Presale has ended!</p>
                    )}
                  </>
                </Reveal>
              )}
              {deadLine > 0 && (
                <Reveal keyframes={fadeInUp} className='onStep' delay={900} duration={800} triggerOnce>
                  <FlipDate value={getUTCDateTime(deadLine)} />
                </Reveal>
              )}

              <ModalVideo channel='youtube' autoplay isOpen={isOpen} videoId="3wRW3t1yQfs" onClose={() => setOpen(false)} />
              <Reveal keyframes={fadeInUp} className='onStep' delay={1200} duration={800} triggerOnce>
                <div className='banner-bottom'>
                  <a href="/whitepaper.pdf" className='btn-orange btn-purchase' target="_blank" rel="noreferrer">
                    WHITEPAPER
                  </a>
                  <div className='btn-overview'>
                    <button className='video-content' onClick={() => setOpen(true)}>
                      <i className="fa-solid fa-play"></i>
                    </button>
                    OVERVIEW
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
          <div className='col-lg-4 col-md-12 move-first flex align-items-center justify-center'>
            <Zoom className="logo-wrapper align-items-center" delay={600} duration={1000} triggerOnce>
              <div className="crypto-logo">
                <div id="ripple"></div>
                <div id="ripple2"></div>
                <div id="ripple3"></div>
                <img src="/img/logo-main.png" className="crypto-logo-img rounded mx-auto d-block pulse2" alt="MAGIC" />
              </div>
            </Zoom>
          </div>
        </div>
      </div>
      <div className="bg-ripple-animation d-md-block">
        <div className="left-bottom-ripples">
          <div className="ripples"></div>
        </div>
        <div className="top-right-ripples">
          <div className="ripples"></div>
        </div>
      </div>
    </div>
  )
};
export default Slidermain;