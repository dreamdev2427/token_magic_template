import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import Reveal from 'react-awesome-reveal';
import { fadeInUp } from '../utils';

const storybox = () => (
  <>
    <div className='story-content'>
      <div className="row">
        <div className='col-md-7 align-self-center'>
          <Reveal className='onStep' keyframes={fadeInUp} delay={0} duration={600} triggerOnce>
            <h1 className='color-purple text-center'>OUR STORY</h1>
          </Reveal>
          <div className='pb-3' data-aos='fade-right' data-aos-delay='300' data-aos-duration="800">
            <Scrollbars autoHide style={{ height: "100px" }}>
              <span className='story-text'>
                Hunger to get our time back, and to provide for our families in a safe and secure way. To achieve this dream, one must think out of the box. Crypto opens up the world to these possibilities.
              </span>
            </Scrollbars>
          </div>
          <div className='pb-3' data-aos='fade-up' data-aos-delay='300' data-aos-duration="800">
            <a href='https://100-days-1.gitbook.io/whitepaper/' target="_blank" rel='noreferrer' className="btn-main btn3 m-auto">Read More</a>
          </div>
        </div>
        <div className='col-md-5 align-self-center' data-aos='fade-left' data-aos-delay='300' data-aos-duration="800">
          <img src="/img/story-nav.png" alt="" />
        </div>
      </div>
    </div>
  </>
);
export default storybox;