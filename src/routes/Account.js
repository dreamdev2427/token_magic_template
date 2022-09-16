/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from '@reach/router';
import { useSelector } from 'react-redux';
import { createGlobalStyle } from 'styled-components';
import { Reveal } from 'react-awesome-reveal';
import { Accordion } from "react-bootstrap";
import ReactToolTip from 'react-tooltip';
import { toast } from 'react-toastify';
// import TradingViewWidget, { Themes, IntervalTypes } from 'react-tradingview-widget';
import RebaseBar from '../components/Dashboard/RebaseBar';
import Rechart from '../components/Dashboard/Rechart';
import { fadeInUp, numberWithCommas, LoadingSkeleton, getUTCNow, sec2str } from '../components/utils';
import { getTotalEarned, getMagicPriceInWeb3 } from '../core/web3';
import { getUserClaimTimes, getClaimPeriod, onClaimMagic } from '../core/Dashboard';
import * as selectors from '../store/selectors';
import { config, def_config } from '../core/config';

const GlobalStyles = createGlobalStyle`
  .dashboard-container {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: column;
    background-size: 100% !important;
    background-position-x: center !important;
    padding: 20px;
    @media only screen and (max-width: 1200px) {
      .col {
        width: 100%;
      }
    }
  }

  .dashboard-title {
    width: fit-content;
    text-overflow: ellipsis;
    white-space: nowrap;
    h3 {
      line-height: 2rem;
    }
  }

  .community-perform {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .progress-content {
    width: 90% !important;
  }

  .calc-card {
    padding: 10px 20px;
    text-align: left;
  }

  .claim-card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    p {
      margin: 1px;
      color: #BCC3CF;
    }
    .sub-title {
      width: 100%;
      text-align: left;
      color: white;
      font-weight: 500;
    }
  }

  .magic-text {
    color: rgb(255, 184, 77) !important;
    font-weight: bold;
    font-size: 24px;
  }

  .claim-value {
    color: #4ed047 !important;
    font-size: 22px;
  }

  .whale-content {
    .accordion-item {
      background-color: transparent;
      border-color: #5947FF;
    }
    .accordion-item:first-of-type .accordion-button {
      border-top-left-radius: 0.3rem;
      border-top-right-radius: 0.3rem;
      font-family: 'Poppins';
      font-size: 16px;
      font-weight: 500;
    }
    .accordion-button {
      padding: 0px 20px;
      background: #151B34;
      color: white;
      &::after {
        background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAgOEgxNiIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxwYXRoIGQ9Ik04IDBMOCAxNiIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIi8+Cjwvc3ZnPgo=");
      }
      &[aria-expanded="true"]::after {
        background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAgOEgxNiIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIi8+Cjwvc3ZnPgo=");
      }
      &:focus {
        box-shadow: none;
      }
    }
    .accordion-body {
      background: #151B34;
      border-top: solid 1px white;
      border-bottom-left-radius: 0.25rem;
      border-bottom-right-radius: 0.25rem;
      border-color: #5947FF;
    }
  }

  .claim-label {
    font-family: "Poppins";
    font-weight: 500;
    color: #BCC3CF;
  }

  .MuiChip-label {
    font-family: "CenturyGothic";
    font-size: 16px;
    letter-spacing: 1px;
  }

  .btn-claim {
    width: calc(100% - 50px);
    justify-content: center;
    margin-left: 25px;
    margin-right: 25px;
    white-space: nowrap;
  }
  .btn-activity {
    margin-left: 10px;
    margin-right: 10px;
    padding: 14px 70px;
    font-size: 16px;
  }
  .tax-guide-left {
    border-left: solid 2px #464d62;
    @media only screen and (max-width: 768px) {
      border: none;
    }
  }
`;

const Account = (props) => {
  const APY = def_config.APY;
  const dailyRate = def_config.DPR;
  const rebaseRate = def_config.REBASE_RATE;
  const balance = useSelector(selectors.userBalance);
  const wallet = useSelector(selectors.userWallet);
  const web3 = useSelector(selectors.web3State);
  const [dailyMagic, setDailyMagic] = useState('');
  const [magicPrice, setMagicPrice] = useState(0);
  const [totalEarned, setTotalEarned] = useState('');
  const [earnedRate, setEarnedRate] = useState('');
  const [nextRebaseAmount, setNextRebaseAmount] = useState('');
  const [claimMagic, setClaimMagic] = useState('');
  const [ROI_rate, setROIRate] = useState('');
  const [ROI_rateUSD, setROIRateUSD] = useState('');
  const [nextClaimTime, setNextClaimTime] = useState(0);
  const [remainTime, setRemainTime] = useState(0);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const getInitAmount = useCallback(async () => {
    console.log('[Wallet] = ', wallet);
    if (!web3) {
      return;
    }

    setLoading(true);
    const ROI = (((1 + rebaseRate) ** 48) ** 30) - 1;
    setROIRate(ROI);
    let nMagicPrice = 0;
    let oneWeek = 0;
    let result = await getMagicPriceInWeb3();
    if (result.success) {
      nMagicPrice = result.magicPrice;
      setMagicPrice(result.magicPrice);
    }

    result = await getTotalEarned();
    if (result.success) {
      setTotalEarned(result.total_earned);
      setEarnedRate(result.earned_rate);
    }

    result = await getClaimPeriod();
    if (result.success) {
      oneWeek = result.oneWeek;
    }
    result = await getUserClaimTimes();
    if (result.success) {
      let claimTime = Math.floor(Number(result.claimTime) + Number(oneWeek) - getUTCNow() / 1000);
      if (claimTime <= 0) {
        claimTime = 0;
      }
      setNextClaimTime(claimTime);
    }

    setDailyMagic(Number(balance.magicBalance) * dailyRate);

    let amount = Number(balance.magicBalance) * rebaseRate;
    setNextRebaseAmount(amount);
    amount = Number(balance.magicBalance) * 0.01;
    setClaimMagic(amount);
    amount = Number(balance.magicBalance) * ROI_rate * nMagicPrice;
    setROIRateUSD(amount);

    setLoading(false);
  }, [web3, ROI_rate, wallet, balance.magicBalance, dailyRate, rebaseRate]);

  const handleClaim = async () => {
    if (claimMagic <= 0) {
      toast.warning('The estimated amount is empty.')
      return;
    }
    let result = await onClaimMagic(claimMagic);
    if (result.success) {
      toast.success('Claimed successfully!');
      let oneWeek = 0;
      result = await getClaimPeriod();
      if (result.success) {
        oneWeek = result.oneWeek;
      }
      result = await getUserClaimTimes();
      if (result.success) {
        let claimTime = Math.floor(Number(result.claimTime) + Number(oneWeek) - getUTCNow() / 1000);
        if (claimTime <= 0) {
          claimTime = 0;
        }
        setNextClaimTime(claimTime);
      }
    } else {
      toast.error('The transaction has been failed: ' + result.error);
    }
  }

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, []);

  useEffect(() => {
    getInitAmount();
  }, [getInitAmount]);

  useEffect(() => {
    if (nextClaimTime > 0) {
      setRemainTime(nextClaimTime);
    }
  }, [nextClaimTime]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (remainTime <= 0) setRemainTime(0);
      else setRemainTime(remainTime - 1);
    }, 1000);
    // Clear timeout if the component is unmounted
    return () => clearTimeout(timer);
  });

  return (
    <div className='page-container dashboard-container'>
      <GlobalStyles />
      <div className="row full-width">
        <div className='col col-md-6 col-sm-12 flex flex-column pb-3'>
          <Reveal keyframes={fadeInUp} className='onStep' delay={0} duration={800} triggerOnce>
            <div className='dashboard-title'>
              <span className='fs-18 f-century fw-bold ls-1 mb-2 ms-4'>YOUR ACCOUNT ACTIVITY</span>
            </div>
          </Reveal>
          <Reveal keyframes={fadeInUp} className='full-card full-height onStep' delay={400} duration={1000} triggerOnce>
            <div className='full-height flex flex-column gap-3'>
              <div className='row'>
                <div className='col-md-6 pb-3'>
                  <div className='main-card'>
                    <p>Your Earnings / Daily</p>
                    {/* <p className='card-value bold fs-40'>{loading ? <LoadingSkeleton /> : `$${numberWithCommas(dailyMagic * magicPrice)}`}</p> */}
                    <p className='card-value fs-40'>--</p>
                    {/* <p className='card-value type-3'>{loading ? <LoadingSkeleton /> : `${numberWithCommas(dailyMagic)} $MGV`}</p> */}
                    <p className='card-value type-3'>--</p>
                  </div>
                </div>
                <div className='col-md-6 pb-3'>
                  <div className='main-card'>
                    <p>APY</p>
                    <p className='card-value text-white'>{numberWithCommas(APY * 100)}%</p>
                    <p className='card-value type-3'>Daily % Rate (DPR): ~{numberWithCommas(dailyRate * 100)}%</p>
                  </div>
                </div>
                <div className='col-md-6 pb-3'>
                  <div className='main-card'>
                    <div className='flex justify-between'>
                      <p>Total Earned</p>
                      {/* <span className={earnedRate >= 0 ? "card-chip up" : "card-chip down"}>{loading ? '' : `${earnedRate >= 0 ? '+' : '-'}${numberWithCommas(Math.abs(earnedRate))}`}%</span> */}
                      <span className={"card-chip up"}>0%</span>
                    </div>
                    {/* <p className={'card-value'}>{loading ? <LoadingSkeleton /> : `$${numberWithCommas(Number(Math.abs(totalEarned)) * magicPrice)}`}</p> */}
                    <p className={'card-value'}>--</p>
                    {/* <p className={'card-value type-3'}>{loading ? <LoadingSkeleton /> : `${numberWithCommas(Number(Math.abs(totalEarned)))} $MGV`}</p> */}
                    <p className={'card-value type-3'}>--</p>
                  </div>
                </div>
                <div className='col-md-6 pb-3'>
                  <div className='main-card'>
                    <p>Your Balance</p>
                    <p className='card-value'>{loading ? <LoadingSkeleton /> : `$${numberWithCommas(Number(balance.magicBalance) * magicPrice)}`}</p>
                    <p className='card-value type-3'>{loading ? <LoadingSkeleton /> : `${numberWithCommas(Number(balance.magicBalance))} $MGV`}</p>
                  </div>
                </div>
                <div className='col-md-12'>
                  <div className='main-card'>
                    <Rechart isChangePositive={true} />
                    {/* <div class="chartview">
                      <TradingViewWidget
                        theme={Themes.DARK}
                        autosize
                        symbol="TraderJoe:ASTROWAVAX"
                        interval={IntervalTypes.D}
                        timezone="Etc/UTC"
                      />
                    </div> */}
                  </div>
                </div>
              </div>
              <div className='full-height flex justify-center align-items-center mb-2'>
                <a href={`https://dexscreener.com/avalanche/`} className='btn-main btn5 btn-activity' target='_blank' rel="noreferrer">DEX Charts</a>
                <button className='btn-main btn-activity' onClick={() => navigate('/swap')}>Buy $MGV</button>
              </div>
            </div>
          </Reveal>
        </div>
        <div className='col col-md-6 col-sm-12 flex flex-column pb-3'>
          <Reveal keyframes={fadeInUp} className='col col-md-6 col-sm-12 onStep' delay={0} duration={800} triggerOnce>
            <div className='dashboard-title'>
              <span className='fs-18 f-century fw-bold ls-1 mb-2 ms-4'>REBASE & CLAIM ACTIVITY</span>
            </div>
          </Reveal>
          <Reveal className='full-card full-height onStep' keyframes={fadeInUp} delay={400} duration={1000} triggerOnce>
            <div className='row'>
              <div className='col-md-5 col-sm-5'>
                <div className='main-card'>
                  <RebaseBar />
                  <div className='flex flex-column'>
                    <p className="text-center fs-14 pt-1 mb-0">NEXT REBASE AMOUNT</p>
                    <p className='fs-24 font-bold text-center mb-0'>{loading ? <LoadingSkeleton /> : '$' + numberWithCommas(nextRebaseAmount * magicPrice)}</p>
                    <p className='f-century-b fs-12 text-gray text-center'>{loading ? <LoadingSkeleton /> : numberWithCommas(nextRebaseAmount) + ' $MGV'}</p>
                  </div>
                  <a className='text-center fs-14 hover:text-white cursor-pointer' data-tip data-for="main">$MGV is auto-compounding</a>
                  <ReactToolTip className='tooltip' id="main" place={'top'} backgroundColor='#702ce9' textColor='white' type="dark" effect="solid" multiline={true}>
                    <span>$MGV is autocompounding, so you do not need to claim unless you want to take profits. You simply hold and earn $MGV automatically.</span>
                  </ReactToolTip>
                </div>
              </div>
              <div className='col-md-7 col-sm-7'>
                <div className='claim-card full-height'>
                  <p className='sub-title fs-16'>Your Daily Claim Quote:</p>
                  <span className='text-left fs-14 text-white'>If you choose to take your weekly claim, click below for 1% to maximize your growth.
                    If you'd like to take more earnings, <span className='underline cursor-pointer' onClick={() => navigate('/swap')}>swap here</span>. </span>
                  <div className='my-3 full-width'>
                    <div className='main-card new-card full-width flex flex-row justify-between align-items-center'>
                      <div className='flex align-items-center gap-2'>
                        <img src="/img/icons/$mgv.png" alt='' width="40px" height="40px"></img>
                        <p className='fs-16 text-white f-medium'>CLAIM $MGV</p>
                      </div>
                      <p className='fs-28 magic-text'>{loading ? <LoadingSkeleton /> : numberWithCommas(claimMagic)}</p>
                    </div>
                  </div>
                  <div className='flex flex-column full-width'>
                    <div className='flex justify-between'>
                      <span className='fs-15 d-flex gap-1'>Your Earnings/Daily: <p className='fs-15 text-white'>1.91%</p></span>
                      <p className='fs-15 text-white'>{loading ? <LoadingSkeleton /> : `${numberWithCommas(Number(dailyMagic))} ($${numberWithCommas(Number(dailyMagic * magicPrice))})`}</p>
                    </div>
                    <div className='flex justify-between'>
                      <span className='fs-15 d-flex gap-1'>Recommended Claim: <p className='fs-15 text-white'>1%</p></span>
                      <p className='fs-15 text-white'>{loading ? <LoadingSkeleton /> : `${numberWithCommas(Number(balance.magicBalance) * 0.01)} ($${numberWithCommas(Number(balance.magicBalance * magicPrice) * 0.01)})`}</p>
                    </div>
                    <div className='flex justify-between'>
                      <span className='fs-15 d-flex gap-1'>Claim Tax: <p className='fs-15 text-white'>0%</p></span>
                      <p className='fs-15 text-white'>{loading ? <LoadingSkeleton /> : `${numberWithCommas(Number(balance.magicBalance) * 0)} ($${numberWithCommas(Number(balance.magicBalance * magicPrice) * 0)})`}</p>
                    </div>
                    <hr className='my-2' />
                  </div>
                  <div className='full-width flex justify-between align-items-center'>
                    <div className='flex flex-column'>
                      <p className='fs-15'>Estimated Amount</p>
                      <p className='fs-15'>You'll Receive in $USDC</p>
                    </div>
                    <span className='fs-26 text-green'>{loading ? <LoadingSkeleton /> : '$' + numberWithCommas(claimMagic * magicPrice)}</span>
                  </div>
                  <div className='full-width flex flex-column justify-center mt-2'>
                    {remainTime <= 0 ? (
                      <button className='d-flex btn-main fs-16 full-width justify-center' onClick={handleClaim} disabled>Weekly Claim (1%)</button>
                    ) : (
                      <button className='d-flex btn-main fs-16 full-width justify-center' disabled>You can Claim again in {sec2str(remainTime)}</button>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-md-12">
                <div className='claim-card mt-3 px-3'>
                  <Accordion className='whale-content full-width pt-2 pb-4'>
                    <Accordion.Item>
                      <Accordion.Header>Tax / Reflections Guide</Accordion.Header>
                      <Accordion.Body className="px-3 py-1">
                        <div className='row'>
                          <div className='col-md-6 col-sm-12 my-2'>
                            <div className='d-flex flex-column'>
                              <p className='text-white fw-bold'>Regular Tax:</p>
                              <div className='flex justify-between'>
                                <p className='fs-12'>Transfer Tax</p>
                                <p className='fs-12 text-white'>15%</p>
                              </div>
                              <div className='flex justify-between'>
                                <p className='fs-12'>Sell Tax</p>
                                <p className='fs-12 text-white'>20%</p>
                              </div>
                            </div>
                          </div>
                          <div className='col-md-6 col-sm-12 tax-guide-left my-2'>
                            <div className='d-flex flex-column'>
                              <p className='text-white fw-bold'>Whale Tax (volumn sell tax):</p>
                              <div className='flex justify-between'>
                                <p className='fs-12'>USD {'>'} 1% of LP</p>
                                <p className='fs-12 text-white'>80%</p>
                              </div>
                              <div className='flex justify-between'>
                                <p className='fs-12'>USD {'>'} 0.5% of LP</p>
                                <p className='fs-12 text-white'>50%</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </div>
              </div>
              <div className='col-md-12'>
                <div className="flex flex-column px-3" style={{ gap: '14px' }}>
                  <div className='flex flex-column flex-md-row justify-between'>
                    <label className='claim-label'>Current $MGV Price</label>
                    <p className='f-medium mb-0 text-right'>{loading ? <LoadingSkeleton /> : '$ ' + numberWithCommas(magicPrice, 4) + ' USD'}</p>
                  </div>
                  <div className='flex flex-column flex-md-row justify-between'>
                    <label className='claim-label'>Next Reward Amount</label>
                    <p className='f-medium mb-0 text-yellow text-right'>{loading ? <LoadingSkeleton /> : numberWithCommas(nextRebaseAmount) + ' $MGV'}</p>
                  </div>
                  <div className='flex flex-column flex-md-row justify-between'>
                    <label className='claim-label'>Next Reward Amount USDC</label>
                    <p className='f-medium mb-0 text-right'>{loading || magicPrice === '' ? <LoadingSkeleton /> : '$ ' + numberWithCommas(nextRebaseAmount * magicPrice) + ' USD'}</p>
                  </div>
                  <div className='flex flex-column flex-md-row justify-between'>
                    <label className='claim-label'>Next Reward Yield</label>
                    <p className='f-medium mb-0 text-right'>{loading ? <LoadingSkeleton /> : numberWithCommas(rebaseRate * 100, 5) + ' %'}</p>
                  </div>
                  <div className='flex flex-column flex-md-row justify-between'>
                    <label className='claim-label'>ROI (30-Day Rate)</label>
                    <p className='f-medium mb-0 text-right'>{loading ? <LoadingSkeleton /> : numberWithCommas(ROI_rate * 100, 2) + ' %'}</p>
                  </div>
                  <div className='flex flex-column flex-md-row justify-between'>
                    <label className='claim-label'>ROI (30-Day Rate) USD</label>
                    <p className='f-medium mb-0 text-right'>{loading ? <LoadingSkeleton /> : '$ ' + numberWithCommas(ROI_rateUSD, 2) + ' USD'}</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div >
  );
};

export default Account;