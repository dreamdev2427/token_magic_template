import React from 'react';
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Scrollbars } from 'react-custom-scrollbars';
import { createGlobalStyle } from 'styled-components';
import Reveal from 'react-awesome-reveal';
import { fadeInUp } from '../utils';

const GlobalStyles = createGlobalStyle`
  .slick-track {
    perspective: 1000px;
  }
  .slick-slide {
    height: 430px;
  }
  @media only screen and (min-width: 992px) {
    .slick-slide:nth-child(1) {
      transform: rotateY(345deg);
      transform-origin: right center;
    }
    .slick-slide:nth-child(3) {
      transform: rotateY(15deg);
      transform-origin: left center;
    }
  }  
`;

const omsSettings = {
  dots: false,
  infinite: false,
  speed: 600,
  slidesToShow: 3,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 3,
      }
    },
    {
      breakpoint: 991,
      settings: {
        slidesToShow: 1,
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
      }
    }
  ]
};

const omsData = [
  {
    key: 1,
    title: 'Auto Staking protocol',
    content: '100 Days provide 1.91% DPR, so APY is 100,003.37%. We guarantee high APY with our Ecosystem.',
  },
  {
    key: 2,
    title: 'MAGIC-NFT',
    content: 'Investors can receive MAGIC-NFT by staking MAGIC tokens. If you own MAGIC-NFT, you can get preferential treatment in our Ecosystem.',
  },
  {
    key: 3,
    title: 'NFT Ecosystem',
    content: '100 Days will launch NFT + DEFI Ecosystem for ensuring APY and get reward. You can mint NFTs and receive reward and trade that NFTs on NFT marketplace.',
  }
]

const WorkBox = () => {
  return (
    <>
      <GlobalStyles />
      <div className='row'>
        <div className='col-md-12'>
          <Reveal className='onStep' keyframes={fadeInUp} delay={0} duration={600} triggerOnce>
            <h1 align="center">How It Works</h1>
          </Reveal>
        </div>
        <div className='col-md-12' data-aos='fade-up' data-aos-delay='300' data-aos-duration="800">
          <Slider {...omsSettings}>
            {omsData.map(item => {
              return (
                <div className="work-box" key={item.key}>
                  <div className="work-item" style={{ backgroundImage: `url(/img/step_${item.key}.png)` }}>
                    <span className='work-step'>
                      STEP-{item.key}
                    </span>
                    <h3 className='work-title'>{item.title}</h3>
                    <Scrollbars autoHide style={{ maxHeight: "210px" }}>
                      <p style={{fontSize: "20px"}}>{item.content}</p>
                    </Scrollbars>
                  </div>
                </div>
              );
            })}
          </Slider>
        </div>
      </div>
    </>
  )
};
export default WorkBox;