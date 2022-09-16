import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import Reveal from 'react-awesome-reveal';
import { fadeInUp } from '../utils';

const TeamBox = () => {
  return (
    <div className='team-container'>
      <div>
        <Reveal className='onStep' keyframes={fadeInUp} delay={0} duration={600} triggerOnce>
          <h1>OUR TEAM</h1>
        </Reveal>
      </div>
      <div className="row" style={{ width: '100%' }}>
        <div className='col-md-4 col-sm-12 mb-2 mt-2' align="center" data-aos='fade-right' data-aos-delay='300' data-aos-duration="800">
          <img src="/img/photo/arsh.jpg" alt=""></img>
        </div>
        <div className='col-md-6 col-sm-12 team-content' data-aos='fade-left' data-aos-delay='300' data-aos-duration="800">
          <h2 className='member-name'>Arsh Johri</h2>
          <Scrollbars autoHide style={{ maxHeight: "80%" }}>
            <div align="left">
              <span>
                Arsh is a Co-founder of 100 Days. He is currently enrolled at Princeton University as a double major in Financial Engineering (ORFE) and Neuroscience. He is a researcher by nature, and as we all know, once someone starts researching crypto they never stop. This is what fascinates and drives Arsh in what he believes to be the new age of finance. In his eyes, crypto is where Finance, Technology and Art merge in harmony. Arsh has been a leader of both Financial and Neuroscience boards hosting events with several Fortune 500 companies raising over $15 million in funding for local organizations. He believes the best way to learn anything is via a collaborative effort, truly being in tune with the community, and leveraging their knowledge in every way possible.
              </span>
            </div>
          </Scrollbars>
        </div>
      </div>
      <div className="row" style={{ width: '100%' }}>
        <div className='col-md-6 col-sm-12 offset-md-2 team-content' data-aos='fade-right' data-aos-delay='300' data-aos-duration="800">
          <h2 className='member-name'>Rohit Chopra</h2>
          <Scrollbars autoHide style={{ maxHeight: "80%" }}>
            <div align="left">
              <span>
                Rohit is a Co-founder of 100 Days. He started as a crypto enthusiast turned investor. Quickly, he realized the true utility and power of the underlying blockchain technology and the positive impact it can have on society as a whole; giving power back to the people. “The change is much bigger than we can imagine.” Before that, Rohit worked in several leadership and strategy roles in Technology across multiple industries. He was a Tech Executive at T-mobile. Others at Walt Disney Company, PriceWaterhouse Coopers, Citigroup, and Microsoft. In his 20’s Rohit formed a private Real Estate Trust Fund and built it up to a $30 million fund in less than a year. Along with that he has formed a Boutique Fitness business from scratch and scaled it to multiple locations across the Greater Seattle area. Rohit dropped out of Harvard to pursue his dreams. He has a growth mindset and is a trusted leader with proven capability to successfully navigate uncharted waters, devise the big picture and execute with strategy and tactics to drive it all the way through multiple domains; delivering high value to its community.
              </span>
            </div>
          </Scrollbars>
        </div>
        <div className='col-md-4 col-sm-12 mb-2 mt-2' align="center" data-aos='fade-left' data-aos-delay='300' data-aos-duration="800">
          <img src="/img/photo/rohit.jpg" alt=""></img>
        </div>
      </div>

      <div className='row' style={{ width: '100%' }}>
        <div className='col-md-4 col-sm-12 mb-2 mt-2' align="center" data-aos='fade-right' data-aos-delay='300' data-aos-duration="800">
          <img src="/img/photo/tommy.jpg" alt=""></img>
        </div>
        <div className='col-md-6 col-sm-12 team-content' data-aos='fade-left' data-aos-delay='300' data-aos-duration="800">
          <h2 className='member-name'>Tommy Stephenson</h2>
          <Scrollbars autoHide style={{ maxHeight: "80%" }}>
            <div align="left">
              <span>
                Tommy is a core member of 100 Days and assistive in overseeing the development aspects of the project. He has an extensive background in this field and brings a ton of experience including but not limited to the following: CTO and Co-Founder of TruTrace Technologies, the first blockchain-centric track and trace platform built for enterprise. Tommy is also founder and CEO of Heated Details, Inc. a 22-year Seattle based award winning design & development firm delivering technology and creative services to fortune 500 companies including Microsoft, Google, Mercedes-Benz. Co-founder of OrionOne Global, a revolutionary global supply chain SaaS platform. Tommy brings tremendous expertise and an impeccable track record in product development and digital marketing for web and mobile solutions. He is a widely respected and sought-after technologist.
              </span>
            </div>
          </Scrollbars>
        </div>
      </div>
      <div className='row' style={{ width: '100%' }}>
        <div className='col-md-6 col-sm-12 offset-md-2 team-content' data-aos='fade-right' data-aos-delay='300' data-aos-duration="800">
          <h2 className='member-name'>Darryl Jordon</h2>
          <Scrollbars autoHide style={{ maxHeight: "80%" }}>
            <div align="left">
              <span>
                Darryl is a core member of 100 Days. He was first introduced to the idea by Arsh back in December 2021, through a formerly named defi project called MetaversePro. There, Darryl had shown his character, conduct, and vision for a more educated and professional approach to the investors of the defi space. He went from discord member to community manager of the 32,000 members of the server, fairly quickly. He implemented a culture of education through impromptu community chats on technical and fundamental analysis indicators, as well as, conducted weekly educational classes covering various topics. Darryl also stressed business conduct, aiming for an expectation of professionalism in his management of the community. In his professional career, he is a pediatric critical care nurse, and with this, he brings the transferable skills of being an advocate for others, detail-oriented, and hard working. He works best under pressure and takes pride in anything he puts his name on, and with this here, consider it applied.
              </span>
            </div>
          </Scrollbars>
        </div>
        <div className='col-md-4 col-sm-12 mb-2 mt-2' align="center" data-aos='fade-left' data-aos-delay='300' data-aos-duration="800">
          <img src="/img/photo/darryl.jpg" alt=""></img>
        </div>
      </div>
    </div>
  )
};
export default TeamBox;