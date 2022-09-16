import React from 'react';
import Reveal from 'react-awesome-reveal';
import { fadeInUp, isMobile } from '../utils';

const RoadMapBox = () => (
  <div className='container'>
    <Reveal className='onStep' keyframes={fadeInUp} delay={0} duration={600} triggerOnce>
      <h1 align="center">Road Map</h1>
    </Reveal>
    <div className="map-content" style={{ background: 'url(/img/roadmap-vector.png)' }}>
      <div className="row">
        <div className='col-md-4 flex justify-content-start' data-aos='zoom-in' data-aos-delay='300' data-aos-duration="500">
          <div className='map-icon'>
            <h1>Q2</h1>
            <h3>2022</h3>
          </div>
        </div>
        <div className='col-md-8 align-self-center' align={'left'} data-aos='fade-up' data-aos-delay='300' data-aos-duration="800">
          <ul className={'left'}>
            <li>Social Media Marketing Campaign</li>
            <li>Community Audit</li>
            <li>Presale</li>
            <li>Launch 100 Days.Finance</li>
            <li>Launch Magic NFT Bank</li>
            <li>Launch NFT Marketplace</li>
            <li>Smart Bonding + Cross liquidity</li>
          </ul>
        </div>
      </div>
      <div className="row">
        <div className='col-md-8 align-self-center' align={isMobile() ? 'left' : 'right'}>
          <ul className={isMobile() ? 'left' : 'right'} data-aos='fade-up' data-aos-delay='300' data-aos-duration="800">
            <li>Artisan Academy</li>
            <li>Magic NFT Collection</li>
            <li>Certik Audit</li>
            <li>SkyNet</li>
            <li>Attend Crypto Conference/s</li>
          </ul>
        </div>
        <div className='col-md-4 flex justify-content-end' data-aos='zoom-in' data-aos-delay='500' data-aos-duration="800">
          <div className='map-icon'>
            <h1>Q3</h1>
            <h3>2022</h3>
          </div>
        </div>
      </div>
      <div className="row">
        <div className='col-md-4 flex justify-content-start' data-aos='zoom-in' data-aos-delay='500' data-aos-duration="800">
          <div className='map-icon'>
            <h1>Q4</h1>
            <h3>2022</h3>
          </div>
        </div>
        <div className='col-md-8 align-self-center' align={'left'}>
          <ul className={'left'} data-aos='fade-up' data-aos-delay='300' data-aos-duration="800">
            <li>Crypto Incubator Rollout and Launch Pad</li>
            <li>New Ecosystem Project/s</li>
            <li>Arcade Games</li>
            <li>Tournaments</li>
            <li>Host in Person Community Events</li>
            <li>Release 2023 Road Map</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);
export default RoadMapBox;