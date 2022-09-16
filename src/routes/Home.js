import React from 'react';
// import Header from '../components/menu/header';
import SliderMain from '../components/Landing/SliderMain';
// import StoryBox from '../components/Landing/StoryBox';
// import CoreValueBox from '../components/Landing/CoreValueBox';
// import OurTeamBox from '../components/Landing/OurTeamBox';
// import WorkBox from '../components/Landing/WorkBox';
// import RoadMapBox from '../components/Landing/RoadMapBox';
// import Faqs from '../components/Landing/Faqs';
// import Footer from '../components/menu/footer';

const Home = (props) => {
  return (
    <div className='home'>
      {/* <Header /> */}
      <nav className='vertical-scroll'>
        <ul>
          <li>
            <a href="https://t.me/magicventures" className='' target="_blank" rel="noreferrer">
              <i className="fa-brands fa-telegram"></i>
            </a>
          </li>
          <li>
            <a href="https://twitter.com/MagicVenture_io" className='' target="_blank" rel="noreferrer">
              <i className="fa-brands fa-twitter"></i>
            </a>
          </li>
          <li>
            <a href="https://discord.gg/93JbgmYsNt" className='' target="_blank" rel="noreferrer">
              <i className="fa-brands fa-discord"></i>
            </a>
          </li>
          <li>
            <a href="/whitepaper.pdf" className='' target="_blank" rel="noreferrer">
              {/* <i className="fa-solid fa-book"></i> */}
              {/* <i className="fa-solid fa-file-pdf"></i> */}
              <i className="fa-solid fa-book-sparkles"></i>
            </a>
          </li>
        </ul>
      </nav>
      <section className="jumbotron no-bg home-box">
        <SliderMain />
      </section>

      {/* <section className='full-container story-container' style={{ backgroundImage: `url(/img/story-bg.png)` }}>
        <div className="container story-box">
          <StoryBox />
        </div>
      </section>

      <section className='full-container pb-0' style={{ backgroundImage: `url(/img/core-value-bg.png)` }}>
        <CoreValueBox />
      </section >

      <section className="full-container" style={{ backgroundImage: `url(/img/back-work.png)` }}>
        <div className='container'>
          <WorkBox />
        </div>
      </section>

      <section className='full-container' style={{ backgroundImage: `url(/img/our-team-bg.png)` }} align="center">
        <div className='container'>
          <OurTeamBox />
        </div>
      </section>

      <section className='full-container' style={{ backgroundImage: `url(/img/roadmap-bg.png)`, backgroundColor: 'rgb(195 37 213 / 10%)' }}>
        <RoadMapBox />
      </section>

      <section className='full-img faq-container' style={{ backgroundImage: `url(/img/faq-bg.png)` }}>
        <div className='container faqs_section'>
          <Faqs />
        </div>
        <Footer />
      </section> */}
    </div >
  )
};
export default Home;