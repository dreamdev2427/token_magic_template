import React from 'react';
import { Accordion, Col, Row } from "react-bootstrap";
import Reveal from 'react-awesome-reveal';
import { fadeInUp } from '../utils';

const faqData = [
  {
    title: `What's MAGIC's utility?`,
    content: `MAGIC will be an auto-staking token working hard to grow in quantity with every 30 minute rebase to accrue 1.91085...% a day for every wallet holding it.`
  },
  {
    title: `Is the team KYC'ed or Doxxed?`,
    content: `You bet your bottom dollar we are! About as public as you can get!
    Click on the link here: https://100-days-1.gitbook.io/whitepaper/the-basics/meeting-the-team#who-is-the-team-behind-100-days to meet the core team!`,
  },
  {
    title: `What is an RFV?`,
    content: `Risk free value are specific assets helping the financial backing of the project's overall valuation and are generally stablecoins
    Stablecoins are tokens that tokenomically structured to be pegged to 1 US Dollar and due to this pegged price, become relatively "risk free" in its valuation.`,
  },
  {
    title: `What is the treasury?`,
    content: `The treasury is our hard working investment portfolio where our received revenue from trading, partnerships and more can accrue greater monetary value to and contribute to the protocol's growing rate of newly wealthy investors on our behalf.`,
  },
  {
    title: `Is 100 Days a fork of Titano?`,
    content: `100 Days shares some features similar to the likes of Titano, with a taxing system on buy and sell to redistribute to the protocol's stability. However, our developers have grounded up the code and made innovated changes that make our overall goal and implementation of such tokenomics to be very different.`,
  }
]

const FaqBox = () => {
  return (
    <Row className="justify-content-center">
      <h1 align="center">FAQs</h1>
      <Col xs={12} lg={9}>
        <Accordion>
          {faqData.map((item, index) => {
            return (
              <Reveal key={index} className='onStep' keyframes={fadeInUp} delay={100 * index} duration={800}>
                <div className='accordion-box'>
                  <Accordion.Item eventKey={{ index }}>
                    <Accordion.Header>{item.title}</Accordion.Header>
                    <Accordion.Body className="p-3">
                      {item.content}
                    </Accordion.Body>
                  </Accordion.Item>
                </div>
              </Reveal>
            )
          }
          )}
        </Accordion>
      </Col>
      <Col xs={12} className="d-flex justify-content-center faq_more_btn" data-aos='fade-up' data-aos-delay='600' data-aos-duration="800">
        <a href='https://100-days-1.gitbook.io/welcome-to-gitbook/tips-and-tricks/faq' target="_blank" rel='noreferrer' className="btn-main btn4">Read More</a>
      </Col>
    </Row>
  )
};
export default FaqBox;