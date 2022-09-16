import React from 'react';
import Reveal from 'react-awesome-reveal';
import { fadeInUp } from '../utils';

const CoreValueBox = () => {
  return (
    <div className='container core-container flex flex-column align-items-center'>
      <Reveal className='onStep' keyframes={fadeInUp} delay={0} duration={600} triggerOnce>
        <h1 align="center">CORE VALUES</h1>
      </Reveal>
      <div className="core-content" 
        style={{ background: `url(/img/core-value.png)`, backgroundSize: '100% 100%' }}
        data-aos='fade-up' data-aos-delay='300' data-aos-duration="800"
      >
        <div className="core-center" 
          style={{ background: 'url(/img/core-center.png', backgroundSize: '100% 100%' }}
          data-aos='zoom-in' data-aos-delay='300' data-aos-duration="800"
        >
          <h1>APY</h1>
          <h2>100,003.37 %</h2>
        </div>
      </div>
    </div>
  )
};
export default CoreValueBox;